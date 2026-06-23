import { consciousnessBus } from "./ConsciousEventBus";

class ConsciousnessEngine {
  constructor() {
    this.narrators = [];
  }

  attach(narratorFn) {
    this.narrators.push(narratorFn);
  }

  start() {
    consciousnessBus.on("DAG_UPDATE", (event) => {
      this.broadcast(`DAG updated with ${event.payload?.nodes?.length || 0} nodes`);
    });

    consciousnessBus.on("MODE_CHANGE", (event) => {
      this.broadcast(`System switched to ${event.mode} mode`);
    });
  }

  broadcast(message) {
    this.narrators.forEach(fn => fn(message));
  }
}

export const consciousnessEngine = new ConsciousnessEngine();
