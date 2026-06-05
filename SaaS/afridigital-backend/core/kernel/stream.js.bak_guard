function createStream(bus) {

  return {
    publish(topic, msg) {
      bus.publish(topic, {
        ...msg,
        ts: Date.now()
      });
    },

    subscribe(topic, fn) {
      bus.subscribe(topic, fn);
    }
  };
}

module.exports = { createStream };
