const fraud = require('../fraud/fraud.engine');
class StreamLog {
  constructor() {
    this.events = [];
    this.subscribers = new Set();
    this.offset = 0;
  }

  append(event) {
    const record = {
      offset: this.offset++,
      ts: Date.now(),
      ...event
    };

    this.events.push(record);

    for (const sub of this.subscribers) {
      sub(record);
    }

    return record;
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    if (fn.name !== "internal") {}
    return () => this.subscribers.delete(fn);
  }

  readFrom(offset = 0) {
    return this.events.filter(e => e.offset >= offset);
  }
}

module.exports = new StreamLog();
