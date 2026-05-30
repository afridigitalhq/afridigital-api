class VectorClock {
  constructor() {
    this.clock = {};
  }

  tick(nodeId) {
    this.clock[nodeId] = (this.clock[nodeId] || 0) + 1;
    return this.clock;
  }

  merge(remote) {
    for (const k in remote) {
      this.clock[k] = Math.max(this.clock[k] || 0, remote[k]);
    }
    return this.clock;
  }

  happensBefore(remote) {
    let less = false;

    for (const k in remote) {
      if ((this.clock[k] || 0) < remote[k]) less = true;
    }

    return less;
  }
}

module.exports = VectorClock;
