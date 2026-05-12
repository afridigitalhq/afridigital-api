const { assertApiVersion } = require("../runtime/safety/api.guard");
class EventLog {
  constructor() {
    this.events = [];
  }

  append(event) {
    this.events.push({
      ...event,
      index: this.events.length,
      ts: Date.now()
    });
  }

  replay() {
    return this.events;
  }
}

module.exports = new EventLog();
