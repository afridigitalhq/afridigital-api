const { assertApiVersion } = require("../runtime/safety/api.guard");
const EventLog = require('../distributed/event.log');

class ForkResolver {
  constructor() {
    this.seenHashes = new Map(); // hash -> occurrences
  }

  detectFork(events) {
    const map = new Map();

    for (const e of events) {
      const key = `${e.userId}:${e.amount}:${e.type}`;

      map.set(key, (map.get(key) || 0) + 1);
    }

    return Array.from(map.entries())
      .filter(([_, count]) => count > 1)
      .map(([key, count]) => ({ key, count }));
  }

  detectInconsistency(nodeSnapshots) {
    const states = nodeSnapshots.map(n => n.sync);

    const base = JSON.stringify(states[0]);
    const inconsistent = states.filter(s => JSON.stringify(s) !== base);

    return {
      consistent: inconsistent.length === 0,
      driftCount: inconsistent.length
    };
  }

  resolve(events) {
    const clean = [];
    const seen = new Set();

    for (const e of events) {
      const h = `${e.userId}-${e.amount}-${e.type}-${e.opId}`;

      if (seen.has(h)) continue;

      seen.add(h);
      clean.push(e);
    }

    return clean;
  }
}

module.exports = new ForkResolver();
