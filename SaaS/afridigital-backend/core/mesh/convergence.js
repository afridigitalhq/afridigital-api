/**
 * Lightweight deterministic convergence engine (stub-safe)
 * Purpose: prevent kernel crash + enable future CRDT upgrade
 */

class ConvergenceEngine {
  constructor(){
    this.clock = new Map(); // vector-clock placeholder
  }

  update(nodeId){
    const prev = this.clock.get(nodeId) || 0;
    this.clock.set(nodeId, prev + 1);
    return this.clock;
  }

  merge(remoteClock = {}){
    for(const [k,v] of Object.entries(remoteClock)){
      const local = this.clock.get(k) || 0;
      this.clock.set(k, Math.max(local, v));
    }
    return this.clock;
  }

  snapshot(){
    return Object.fromEntries(this.clock);
  }
}

module.exports = ConvergenceEngine;
