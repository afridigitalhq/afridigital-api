// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const adapters = new Map();

function registerAdapter(name, handler) {
  if (adapters.has(name)) {
    throw new Error("Duplicate adapter blocked: " + name);
  }
  adapters.set(name, handler);
}

function getAdapter(name) {
  return adapters.get(name);
}

module.exports = { registerAdapter, getAdapter };
