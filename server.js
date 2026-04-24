console.log("🚀 NEW SERVER FILE RUNNING");
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.post("/bfhl", (req, res) => {
    const data = req.body.data;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: "Invalid input format" });
    }

    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdges = [];
    const seen = new Set();

    // ✅ STEP 1: VALIDATION
    data.forEach((item) => {
        if (typeof item !== "string") {
            invalidEntries.push(item);
            return;
        }

        const trimmed = item.trim();
        const regex = /^[A-Z]->[A-Z]$/;

        if (!regex.test(trimmed)) {
            invalidEntries.push(item);
            return;
        }

        const [parent, child] = trimmed.split("->");

        if (parent === child) {
            invalidEntries.push(item);
            return;
        }

        if (seen.has(trimmed)) {
            if (!duplicateEdges.includes(trimmed)) {
                duplicateEdges.push(trimmed);
            }
            return;
        }

        seen.add(trimmed);
        validEdges.push([parent, child]);
    });

    // ✅ STEP 2: BUILD GRAPH
    const graph = {};
    const childSet = new Set();

    validEdges.forEach(([p, c]) => {
        if (!graph[p]) graph[p] = [];
        graph[p].push(c);
        childSet.add(c);
    });

    // Ensure all nodes exist
    validEdges.forEach(([p, c]) => {
        if (!graph[c]) graph[c] = [];
    });

    // ✅ STEP 3: FIND ROOTS
    let roots = Object.keys(graph).filter(node => !childSet.has(node));

    // If no root → cycle case
    if (roots.length === 0) {
        roots = [Object.keys(graph).sort()[0]];
    }

    const visitedGlobal = new Set();
    const hierarchies = [];
    let totalCycles = 0;
    let totalTrees = 0;
    let maxDepth = 0;
    let largestTreeRoot = "";

    // ✅ DFS FUNCTION
    function dfs(node, visitedLocal, path) {
        if (path.has(node)) {
            return { cycle: true };
        }

        path.add(node);

        let children = graph[node];
        let tree = {};
        let depth = 1;
        let hasCycle = false;

        for (let child of children) {
            const result = dfs(child, visitedLocal, new Set(path));

            if (result.cycle) {
                hasCycle = true;
            } else {
                tree[child] = result.tree;
                depth = Math.max(depth, 1 + result.depth);
            }
        }

        return {
            tree,
            depth,
            cycle: hasCycle
        };
    }

    // ✅ BUILD HIERARCHIES
    roots.forEach(root => {
        const result = dfs(root, new Set(), new Set());

        if (result.cycle) {
            totalCycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            totalTrees++;
            hierarchies.push({
                root,
                tree: { [root]: result.tree },
                depth: result.depth
            });

            if (
                result.depth > maxDepth ||
                (result.depth === maxDepth && root < largestTreeRoot)
            ) {
                maxDepth = result.depth;
                largestTreeRoot = root;
            }
        }
    });

    res.json({
        user_id: "yourname_ddmmyyyy",
        email_id: "your_email",
        college_roll_number: "your_roll",
        hierarchies,
        invalid_entries: invalidEntries,
        duplicate_edges: duplicateEdges,
        summary: {
            total_trees: totalTrees,
            total_cycles: totalCycles,
            largest_tree_root: largestTreeRoot
        }
    });
});