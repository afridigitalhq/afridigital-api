class PluginSubscriptionManager {
  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(pluginId, eventType) {
    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, new Set());
    }
    this.subscriptions.get(eventType).add(pluginId);
    return { ok: true };
  }

  unsubscribe(pluginId, eventType) {
    if (!this.subscriptions.has(eventType)) {
      return { ok: false };
    }

    this.subscriptions.get(eventType).delete(pluginId);

    if (this.subscriptions.get(eventType).size === 0) {
      this.subscriptions.delete(eventType);
    }

    return { ok: true };
  }

  subscribers(eventType) {
    return Array.from(this.subscriptions.get(eventType) || []);
  }

  snapshot() {
    const out = {};

    for (const [event, plugins] of this.subscriptions.entries()) {
      out[event] = Array.from(plugins);
    }

    return out;
  }
}

module.exports = new PluginSubscriptionManager();
