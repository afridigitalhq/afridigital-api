// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * SINGLE LIVE COCKPIT DASHBOARD
 * Unified control-plane UI state aggregator
 */

class LiveCockpit {
  constructor({ wsFeed, replay, forecast, fault }) {
    this.ws = wsFeed;
    this.replay = replay;
    this.forecast = forecast;
    this.fault = fault;
  }

  render() {
    return {
      live: this._live(),
      history: this._history(),
      predictions: this._predictions(),
      safety: this._safety()
    };
  }

  _live() {
    return this.ws?.latest?.() || {};
  }

  _history() {
    return this.replay?.getTimeline?.() || [];
  }

  _predictions() {
    return this.forecast?.renderForecast?.() || {};
  }

  _safety() {
    return this.fault?.render?.() || {};
  }
}

module.exports = { LiveCockpit };
