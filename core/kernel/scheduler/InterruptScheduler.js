// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class InterruptScheduler {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  interrupt(event) {
    const priority = event.priority ?? 5;

    this.queue.push({
      ...event,
      priority,
      ts: Date.now()
    });

    // higher priority first
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  next() {
    return this.queue.shift();
  }

  hasWork() {
    return this.queue.length > 0;
  }
}

module.exports = { InterruptScheduler };
