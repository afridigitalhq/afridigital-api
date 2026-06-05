const { EventEmitter } = require("events");

/**
 * Fallback in-memory bus (used if Redis is unavailable)
 */
class MemoryBus extends EventEmitter {
  publish(event, data) {
    this.emit(event, data);
  }
}

/**
 * Main Mesh Bootstrap
 */
function createAfriBrainMesh({ redis, wss, flowEngine, tick }) {

  const bus = redis?.publish ? redis : new MemoryBus();

  // -------------------------
  // FLOW TICK INTEGRATION
  // -------------------------
  if (tick?.startKernelTick) {
    tick.startKernelTick({
      interval: 200,
      bus,
      flowEngine
    });
  }

  // -------------------------
  // REDIS FANOUT LAYER
  // -------------------------
  if (redis?.subscribe) {
    try {
      redis.subscribe("kernel:tick", (msg) => {
        bus.publish("mesh:tick", msg);
      });
    } catch (e) {
      console.log("Redis mesh fallback active");
    }
  }

  // -------------------------
  // WEBSOCKET BROADCAST LAYER
  // -------------------------
  if (wss) {
    bus.on("mesh:tick", (data) => {
      const payload = JSON.stringify({
        type: "AFRIBRAIN_TICK",
        data
      });

      wss.clients?.forEach((client) => {
        if (client.readyState === 1) {
          client.send(payload);
        }
      });
    });
  }

  // -------------------------
  // ADMIN GRAPH FEED
  // -------------------------
  bus.on("mesh:tick", (data) => {
    global.__AFRIBRAIN_GRAPH__ = {
      lastTick: Date.now(),
      state: data
    };
  });

  console.log("🧬 AfriBrain Mesh Bootstrap ACTIVE");

  return bus;
}

module.exports = { createAfriBrainMesh };
