function createDispatcher(bus, registry) {

  function dispatch(target, payload) {
    bus.publish("kernel.task", {
      target,
      payload,
      traceId: payload.traceId || Date.now().toString()
    });
  }

  function bind() {
    bus.subscribe("kernel.task", async (msg) => {
      const worker = registry.get(msg.target);

      if (!worker) {
        console.log("❌ NO WORKER:", msg.target);
        return;
      }

      await worker(msg.payload, bus);
    });
  }

  return { dispatch, bind };
}

module.exports = { createDispatcher };
