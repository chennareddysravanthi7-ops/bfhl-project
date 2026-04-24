const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
// app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/test", (req, res) => {
  console.log("GET /test called");
  res.json({ok: true});
});

app.post("/bfhl", (req, res) => {
  console.log("Request received", req.body);
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "data must be an array" });
    }

    const invalid_entries = [];
    const duplicate_edges = [];
    const seen = new Set();
    const graph = new Map(); // node -> children
    const parents_full = new Map(); // node -> list of parents
    const parents = new Map(); // node -> first parent

    for (const edge of data) {
      const trimmed = edge.trim();
      if (!isValidEdge(trimmed)) {
        invalid_entries.push(edge);
        continue;
      }
      if (seen.has(trimmed)) {
        if (!duplicate_edges.includes(trimmed)) duplicate_edges.push(trimmed);
        continue;
      }
      seen.add(trimmed);
      const [from, to] = trimmed.split('->');
      if (!graph.has(from)) graph.set(from, []);
      graph.get(from).push(to);
      if (!parents_full.has(to)) parents_full.set(to, []);
      parents_full.get(to).push(from);
      if (!parents.has(to)) {
        parents.set(to, from);
      }
    }

    // Get all nodes
    const allNodes = new Set();
    for (const [from, tos] of graph) {
      allNodes.add(from);
      tos.forEach(to => allNodes.add(to));
    }

    // Find roots: nodes not in parents_full
    const roots = [];
    for (const node of allNodes) {
      if (!parents_full.has(node)) {
        roots.push(node);
      }
    }

    // Sort roots for consistent order
    roots.sort();

    const hierarchies = [];
    const visited = new Set();

    for (const root of roots) {
      if (visited.has(root)) continue;
      const component = getComponent(root, graph);
      component.forEach(n => visited.add(n));
      const cycleDetected = hasCycle(root, graph, new Set(), new Set());
      if (cycleDetected) {
        const sortedComponent = Array.from(component).sort();
        hierarchies.push({
          root: sortedComponent[0],
          tree: {},
          has_cycle: true
        });
      } else {
        const tree = buildTree(root, graph, parents);
        hierarchies.push({
          root,
          tree,
          has_cycle: false
        });
      }
    }

    // Summary
    let total_trees = 0;
    let total_cycles = 0;
    let largest_tree_root = null;
    let max_depth = 0;
    for (const h of hierarchies) {
      if (h.has_cycle) {
        total_cycles++;
      } else {
        total_trees++;
        const depth = getDepth(h.tree);
        if (depth > max_depth || (depth === max_depth && (!largest_tree_root || h.root < largest_tree_root))) {
          max_depth = depth;
          largest_tree_root = h.root;
        }
      }
    }

    const summary = {
      total_trees,
      total_cycles,
      largest_tree_root
    };

    res.json({
      user_id: "john_doe_17091999",
      email_id: "john@xyz.com",
      college_roll_number: "ABCD123",
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});