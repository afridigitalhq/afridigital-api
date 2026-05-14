const { appendEvent } = require("./event.log");
const { routeEvent } = require("./partitioner");

class EventBroker {
  constructor() {
    this.consumers = new Map(); // group -> handlers
  }

  publish(event) {
    const routed = routeEvent(event);

    appendEvent(routed);

    const group = routed.type;

    const handlers = this.consumers.get(group) || [];
    for (const h of handlers) {
      h(routed);
    }

    return routed;
  }

  subscribe(group, handler) {
    if (!this.consumers.has(group)) {
      this.consumers.set(group, []);
    }
    this.consumers.get(group).push(handler);
  }
}

module.exports = new EventBroker();
