/**
 * 🧊 STORAGE ADAPTER (Redis / Mongo PLUGGABLE)
 * Placeholder system for future DB swap
 */

class StoreAdapter {

  constructor(provider = "memory") {
    this.provider = provider;
    this.memory = new Map();
  }

  async set(key, value) {
    if (this.provider === "memory") {
      this.memory.set(key, value);
    }
    // future: redis / mongo
    return true;
  }

  async get(key) {
    if (this.provider === "memory") {
      return this.memory.get(key);
    }
    return null;
  }

  async incr(key) {
    const val = (await this.get(key)) || 0;
    const newVal = val + 1;
    await this.set(key, newVal);
    return newVal;
  }
}

module.exports = { StoreAdapter };
