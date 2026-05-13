const { appendEvent } = require("../eventlog/event.log");
const { routeToNodes } = require("./event.router");

class DistributedBroker {
  constructor() {
    this.localConsumers = new Map();
  }

  publish(event) {
    const nodes = routeToNodes(event, 2);

    const stored = appendEvent({
      ...event,
      replicatedOn: nodes.map(n => n.id)
    });

    const group = event.type;

    const handlers = this.localConsumers.get(group) || [];
    for (const h of handlers) {
      h(event);
    }

    return {
      event: stored,
      replicatedTo: nodes
    };
  }

  subscribe(group, handler) {
    if (!this.localConsumers.has(group)) {
      this.localConsumers.set(group, []);
    }
    this.localConsumers.get(group).push(handler);
  }
}

module.exports = new DistributedBroker();
