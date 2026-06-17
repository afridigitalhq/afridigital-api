
class EventMesh {
  constructor() {
    this.subs = new Map();
  }

  publish(event, payload) {
    const listeners = this.subs.get(event) || [];
    for (const fn of listeners) fn(payload);
  }

  subscribe(event, fn) {
    if (!this.subs.has(event)) this.subs.set(event, []);
    this.subs.get(event).push(fn);
  }
}

const mesh = new EventMesh();

module.exports = mesh;

