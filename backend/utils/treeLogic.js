// utils/treeLogic.js

function hasCycle(node, graph, visited, recStack) {
  visited.add(node);
  recStack.add(node);
  for (const child of graph.get(node) || []) {
    if (!visited.has(child) && hasCycle(child, graph, visited, recStack)) return true;
    if (recStack.has(child)) return true;
  }
  recStack.delete(node);
  return false;
}

function getComponent(start, graph) {
  const visited = new Set();
  const stack = [start];
  visited.add(start);
  while (stack.length) {
    const node = stack.pop();
    for (const child of graph.get(node) || []) {
      if (!visited.has(child)) {
        visited.add(child);
        stack.push(child);
      }
    }
  }
  return visited;
}

function buildTree(node, graph, parents) {
  const tree = {};
  for (const child of graph.get(node) || []) {
    if (parents.get(child) === node) {
      tree[child] = buildTree(child, graph, parents);
    }
  }
  return tree;
}

function getDepth(tree) {
  if (Object.keys(tree).length === 0) return 1;
  return 1 + Math.max(...Object.values(tree).map(getDepth));
}

function processHierarchies(graph, parents_full, parents) {
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

  return hierarchies;
}

function getSummary(hierarchies) {
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

  return { total_trees, total_cycles, largest_tree_root };
}

module.exports = { processHierarchies, getSummary };