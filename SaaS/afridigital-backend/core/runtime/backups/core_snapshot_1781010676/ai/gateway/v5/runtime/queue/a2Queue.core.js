const RedisAdapter = require("./adapters/redisAdapter");

class A2QueueCore {
  constructor() {
    this.adapter = new RedisAdapter();
  }

  async publish(job) {
    return await this.adapter.enqueue(job);
  }

  async consume(workerId) {
    return await this.adapter.claim(workerId);
  }

  async ack(job) {
    return await this.adapter.update(job);
  }

  async size() {
    return await this.adapter.size();
  }
}

module.exports = new A2QueueCore();
