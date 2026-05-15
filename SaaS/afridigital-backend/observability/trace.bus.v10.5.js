class TraceBusV10_5 {
  constructor() {
    this.traces = [];
  }

  emit(event) {
    const trace = {
      id: "TRACE_" + Date.now(),
      ts: Date.now(),
      event
    };
    this.traces.push(trace);
    console.log("[TRACE]", JSON.stringify(trace));
  }

  dump() {
    return this.traces;
  }

  clear() {
    this.traces = [];
  }
}

module.exports = new TraceBusV10_5();
