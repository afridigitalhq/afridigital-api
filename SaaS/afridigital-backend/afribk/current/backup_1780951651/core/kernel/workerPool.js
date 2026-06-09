function createWorkerPool(registry) {

  function scale(name, handler) {
    registry.register(name, handler);
    console.log("📦 WORKER ADDED TO POOL:", name);
  }

  function list() {
    return registry.list();
  }

  return { scale, list };
}

module.exports = { createWorkerPool };
