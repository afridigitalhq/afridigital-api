const { domains } = require("../registry");

function resolvePath(start, target) {
  const graph = domains;

  const queue = [[start]];
  const visited = new Set();

  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === target) return path;
    if (visited.has(node)) continue;

    visited.add(node);

    for (const next of (graph[node] || [])) {
      queue.push([...path, next]);
    }
  }

  return [start, target]; // fallback direct path
}

function planExecution(from, to) {
  return {
    type: "dag",
    path: resolvePath(from, to)
  };
}

module.exports = {
  planExecution
};
