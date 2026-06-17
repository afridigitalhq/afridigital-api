const registry = [];

function registerListener(meta) {
  registry.push({
    ...meta,
    registeredAt: Date.now()
  });
}

function getListeners() {
  return registry;
}

module.exports = { registerListener, getListeners };
