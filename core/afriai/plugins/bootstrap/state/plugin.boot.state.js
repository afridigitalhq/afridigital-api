class PluginBootState {
  constructor() {
    this.state = {
      booted: false,
      timestamp: null,
      runs: 0
    };
  }

  isBooted() {
    return this.state.booted;
  }

  markBooted() {
    this.state.booted = true;
    this.state.timestamp = Date.now();
    this.state.runs += 1;
    return this.state;
  }

  reset() {
    this.state.booted = false;
    this.state.timestamp = null;
    this.state.runs = 0;
  }

  snapshot() {
    return {
      ...this.state
    };
  }
}

module.exports = new PluginBootState();
