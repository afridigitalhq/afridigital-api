/**
 * WORKER CONTRACT:
 * must return executable function
 */

const plugins = {};

/**
 * Static workers (safe defaults)
 */
const workers = {
  africore: (node, ctx) => ({ node, ok: true, type: "africore" }),
  agents: (node, ctx) => ({ node, ok: true, type: "agents" }),
  integrations: (node, ctx) => ({ node, ok: true, type: "integrations" }),
  whatsapp: (node, ctx) => ({ node, ok: true, type: "whatsapp" })
};

/**
 * Register runtime plugin
 */
function registerPlugin(name, fn) {
  plugins[name] = fn;
}

/**
 * Resolve worker (MUST return function)
 */
function resolveWorker(node) {
  if (plugins[node]) return plugins[node];
  if (workers[node]) return workers[node];

  return (n, ctx) => ({
    node: n,
    status: "NO_WORKER",
    ctx
  });
}

module.exports = {
  registerPlugin,
  resolveWorker
};
