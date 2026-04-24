// utils/validation.js

function isValidEdge(edge) {
  const trimmed = edge.trim();
  if (!/^[A-Z]->[A-Z]$/.test(trimmed)) return false;
  const [from, to] = trimmed.split('->');
  return from !== to;
}

function validateAndProcessData(data) {
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

  return { graph, parents_full, parents, invalid_entries, duplicate_edges };
}

module.exports = { isValidEdge, validateAndProcessData };