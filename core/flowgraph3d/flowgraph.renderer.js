const bus = require('../runtime/event.bus');

class FlowGraph3DRenderer {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.queue = [];
  }

  ingest(event) {
    this.queue.push({
      type: event.type,
      traceId: event.traceId || 'system',
      payload: event.payload || {},
      ts: Date.now()
    });
  }

  buildGraph() {
    while (this.queue.length) {
      const e = this.queue.shift();

      const id = e.traceId + ':' + e.type;

      if (!this.nodes.has(id)) {
        this.nodes.set(id, {
          id,
          type: e.type,
          intensity: 1,
          lastSeen: e.ts
        });
      } else {
        const n = this.nodes.get(id);
        n.intensity += 1;
        n.lastSeen = e.ts;
      }

      this.edges.push({
        from: e.traceId,
        to: e.type,
        weight: 1,
        ts: e.ts
      });
    }
  }

  start() {
    console.log("🌐 FLOWGRAPH 3D STREAM ENGINE ACTIVE (READ-ONLY)");

    bus.onAny?.((type, payload) => {
      this.ingest({
        type,
        traceId: payload?.traceId,
        payload
      });
    });

    setInterval(() => this.buildGraph(), 100);
  }
}

module.exports = FlowGraph3DRenderer;
