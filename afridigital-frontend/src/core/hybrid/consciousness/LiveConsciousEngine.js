export class LiveConsciousEngine {
  constructor({ emitter }) {
    this.emitter = emitter;
  }

  emit(event) {
    const narrative = this.interpret(event);

    if (this.emitter) {
      this.emitter(narrative);
    }
  }

  interpret(event) {
    const map = {
      "dag.node.created": "A new computation node has entered the system.",
      "dag.node.failed": "A node has destabilized inside the DAG flow.",
      "ws.latency.high": "Network instability detected. Switching to fallback routing.",
      "gpu.load.high": "Rendering pressure increasing. Activating safe mode.",
      "system.hybrid.live": "System has entered live synchronization mode.",
      "system.hybrid.rest": "System stabilized in REST fallback mode."
    };

    return map[event.type] || "System state updated across the infrastructure layer.";
  }
}
