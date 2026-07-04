export class SOCFlowController {
  constructor(eventBus) {
    this.eventBus = eventBus;

    this.limits = {
      CRITICAL: 50,
      HIGH: 20,
      NORMAL: 10
    };

    this.bucket = {
      CRITICAL: 0,
      HIGH: 0,
      NORMAL: 0
    };

    this.lastReset = Date.now();
  }

  canProcess(priority = "NORMAL") {
    this._resetIfNeeded();

    if (this.bucket[priority] < this.limits[priority]) {
      this.bucket[priority]++;
      return true;
    }

    return false;
  }

  guard(event, payload, priority = "NORMAL") {
    if (!this.canProcess(priority)) {
      this.eventBus.emit("FLOW_THROTTLED", {
        event,
        priority,
        timestamp: Date.now()
      });
      return false;
    }

    this.eventBus.emit(event, payload);
    return true;
  }

  _resetIfNeeded() {
    const now = Date.now();

    if (now - this.lastReset > 1000) {
      this.bucket.CRITICAL = 0;
      this.bucket.HIGH = 0;
      this.bucket.NORMAL = 0;
      this.lastReset = now;
    }
  }

  getStatus() {
    return {
      usage: this.bucket,
      limits: this.limits
    };
  }
}

export const createFlowController = (eventBus) => {
  return new SOCFlowController(eventBus);
};
