const redis = require('./client');
const CHANNEL = 'afri:graph:events';

class Bus {
  constructor() {
    this.sub = redis.duplicate();
  }

  async init(onEvent) {
    await this.sub.subscribe(CHANNEL);
    this.sub.on('message', (_, msg) => {
      try { onEvent(JSON.parse(msg)); } catch(e){}
    });
  }

  publish(event) {
    redis.publish(CHANNEL, JSON.stringify(event));
  }
}

module.exports = new Bus();
