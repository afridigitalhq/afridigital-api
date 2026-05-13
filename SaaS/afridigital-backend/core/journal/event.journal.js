class EventJournal {
  constructor() {
    this.events = [];
    this.seq = 0;
  }

  append(event) {
    const record = {
      seq: ++this.seq,
      ts: Date.now(),
      ...event
    };

    this.events.push(record);
    return record;
  }

  readFrom(seq = 0) {
    return this.events.filter(e => e.seq >= seq);
  }

  clear() {
    this.events = [];
    this.seq = 0;
  }
}

module.exports = new EventJournal();
