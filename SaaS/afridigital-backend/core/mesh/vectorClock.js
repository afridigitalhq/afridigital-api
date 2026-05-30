class VectorClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.clock = {};
  }

  tick() {
    this.clock[this.nodeId] = (this.clock[this.nodeId] || 0) + 1;
    return this.clock;
  }

  update(incoming) {
    for (const [node, time] of Object.entries(incoming)) {
      this.clock[node] = Math.max(this.clock[node] || 0, time);
    }
    this.tick();
    return this.clock;
  }

  compare(a, b) {
    let aBefore = false;
    let bBefore = false;

    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

    for (const k of keys) {
      const av = a[k] || 0;
      const bv = b[k] || 0;

      if (av < bv) aBefore = true;
      if (av > bv) bBefore = true;
    }

    if (aBefore && !bBefore) return -1;
    if (!aBefore && bBefore) return 1;
    return 0; // concurrent
  }
}

module.exports = VectorClock;
