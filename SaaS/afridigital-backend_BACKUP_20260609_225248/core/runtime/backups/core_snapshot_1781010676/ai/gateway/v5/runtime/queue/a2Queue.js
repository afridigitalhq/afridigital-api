const RedisAdapter = require("./adapters/redisAdapter");

/**
 * A2 Queue v4
 * Now Redis-ready with fallback
 */

class A2Queue {
  constructor() {
    this.adapter = new RedisAdapter();
  }

  enqueue(job) {
    return this.adapter.enqueue(job);
  }

  claim(workerId) {
    return this.adapter.claim(workerId);
  }

  update(job) {
    return this.adapter.update(job);
  }

  size() {
    return this.adapter.size();
  }
}

module.exports = new A2Queue();
