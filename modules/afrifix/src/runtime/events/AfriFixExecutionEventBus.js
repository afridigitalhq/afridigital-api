export class AfriFixExecutionEventBus {
  constructor() {
    this.events = [];
    this.sequence = 0;
  }

  publish(type, payload = {}) {
    this.sequence++;

    const event = {
      eventId: `evt-${Date.now()}-${this.sequence}`,
      sequence: this.sequence,
      type,
      executionId: payload.executionId || null,
      module: payload.module || null,
      action: payload.action || null,
      timestamp: new Date().toISOString(),
      payload
    };

    this.events.push(event);
    return event;
  }

  list() {
    return this.events;
  }

  byExecution(executionId) {
    return this.events.filter(e => e.executionId === executionId);
  }

  clear() {
    this.events = [];
    this.sequence = 0;

    return {
      component: "AfriFix Execution Event Bus",
      status: "CLEARED"
    };
  }
}
