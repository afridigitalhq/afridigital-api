const journal = require("./event.journal");

class EventStream {
  constructor() {
    this.subscribers = new Set();
    this.lastSeq = 0;
  }

  publish(event) {
    const record = journal.append(event);
    this.lastSeq = record.seq;

    for (const sub of this.subscribers) {
      try { sub(record); } catch (e) {}
    }

    return record;
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  tail(fromSeq = 0) {
    return journal.readFrom(fromSeq);
  }
}

module.exports = new EventStream();
