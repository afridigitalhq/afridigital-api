const VectorClock = require('../vclock');

class CausalLayer {
  constructor(bus) {
    this.bus = bus;
    this.vclock = new VectorClock();
  }

  wrapEmit(emitFn) {
    return (nodeId, event) => {
      const clock = this.vclock.tick(nodeId);

      const enrichedEvent = {
        ...event,
        __causal: {
          nodeId,
          clock,
          ts: Date.now()
        }
      };

      return emitFn(nodeId, enrichedEvent);
    };
  }

  subscribe(type, handler) {
    return this.bus.subscribe(type, handler);
  }

  mergeRemoteClock(remoteClock) {
    return this.vclock.merge(remoteClock);
  }
}

module.exports = CausalLayer;
