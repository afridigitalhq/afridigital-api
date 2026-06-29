class TimelineIndexer {
  constructor() {
    this.events = [];
  }

  index(event) {
    const record = {
      id: event.id || Math.random().toString(36).slice(2),
      type: event.type || "unknown",
      time: Date.now(),
      payload: event
    };
    this.events.push(record);
    return record;
  }

  getTimeline() {
    return this.events;
  }
}

module.exports = { TimelineIndexer };
