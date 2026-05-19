const { assertApiVersion } = require("../runtime/safety/api.guard");
class IdempotencyStore {
  constructor() {
    this.keys = new Set();
  }

  has(key) {
    return this.keys.has(key);
  }

  save(key) {
    this.keys.add(key);
  }
}

module.exports = new IdempotencyStore();
