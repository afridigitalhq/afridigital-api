import { store } from "../core/store";

export class SystemOrchestrator {
  constructor() {
    this.subscribers = [];
  }

  register(handler) {
    this.subscribers.push(handler);
  }

  dispatch(event) {
    // normalize event
    const normalized = {
      ...event,
      ts: event.ts || Date.now(),
      severity: event.severity || "info"
    };

    // push to redux timeline
    store.dispatch({ type: "dag/applyEvent", payload: normalized });

    // broadcast to all subsystems
    this.subscribers.forEach(fn => fn(normalized));
  }
}

export const orchestrator = new SystemOrchestrator();
