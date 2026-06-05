class CRDTState {
  constructor() {
    this.state = {};
  }

  apply(key, value) {
    // LWW (Last Write Wins CRDT baseline)
    this.state[key] = {
      value,
      ts: Date.now()
    };
  }

  merge(remoteState) {
    for (const k in remoteState) {
      if (
        !this.state[k] ||
        remoteState[k].ts > this.state[k].ts
      ) {
        this.state[k] = remoteState[k];
      }
    }
  }

  get() {
    return Object.fromEntries(
      Object.entries(this.state).map(([k,v]) => [k, v.value])
    );
  }
}

module.exports = CRDTState;
