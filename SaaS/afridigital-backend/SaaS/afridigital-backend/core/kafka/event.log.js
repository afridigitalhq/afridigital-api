class EventLog {
  constructor() {
    this.events = [];
    this.offset = 0;
  }

  append(event) {
    const record = {
      offset: this.offset++,
      ...event,
      ts: Date.now()
    };

    this.events.push(record);
    return record;
  }

  readFrom(offset = 0) {
    return this.events.filter(e => e.offset >= offset);
  }

  tail(limit = 100) {
    return this.events.slice(-limit);
  }
}

module.exports = new EventLog();
