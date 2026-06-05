const nodes = new Map();

function register(name, handler, meta = {}) {
  nodes.set(name, { handler, meta, ts: Date.now() });
  console.log("🧩 NODE REGISTERED:", name);
}

function get(name) {
  return nodes.get(name)?.handler;
}

function list() {
  return [...nodes.keys()];
}

module.exports = { register, get, list };
