class PluginHealth {
  constructor() {
    this.health = new Map();
  }

  update(id, status) {
    this.health.set(id, {
      id,
      status,
      ts: Date.now()
    });

    return this.health.get(id);
  }

  get(id) {
    return this.health.get(id) || null;
  }

  all() {
    return [...this.health.values()];
  }

  summary() {
    const summary = {
      HEALTHY: 0,
      DEGRADED: 0,
      FAILED: 0,
      STOPPED: 0
    };

    for (const item of this.health.values()) {
      if (summary[item.status] !== undefined) {
        summary[item.status]++;
      }
    }

    return summary;
  }
}

module.exports = new PluginHealth();
