const { emit, channels } = require("../redis/redis.spine.cjs");

class EventBus {
  static publish(type, data) {
    emit(channels.events, {
      type,
      data,
      ts: Date.now()
    });
  }
}

module.exports = EventBus;
