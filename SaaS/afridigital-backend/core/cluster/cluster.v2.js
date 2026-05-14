const crypto = require("crypto");

const hub = require("../realtime/event.hub");
const durableJournal = require("../journal/durable.journal");

class ClusterV2 {
  constructor() {
    this.buffer = durableJournal.readAll();
    this.seq = this.buffer.length;
  }

  emit(event) {

    const normalized = {
      id: crypto.randomUUID(),
      traceId: crypto.randomUUID(),
      seq: ++this.seq,

      type: event.type,
      category: event.category,

      ts: Date.now(),

      cluster: "AFRIBANK-CLUSTER-V6",
      source: event.source || "api",

      payload: event.payload || {}
    };

    normalized.hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(normalized))
      .digest("hex");

    this.buffer.push(normalized);

    if (this.buffer.length > 1000) {
      this.buffer.shift();
    }

    durableJournal.append(normalized);

    hub.emitEvent(normalized);

    return {
      ok: true,
      cluster: "v6",
      seq: normalized.seq,
      traceId: normalized.traceId,
      stored: this.buffer.length
    };
  }

  replay(limit = 50) {
    return {
      ok: true,
      cluster: "v6",
      total: this.buffer.length,
      events: this.buffer.slice(-limit)
    };
  }
}

module.exports = new ClusterV2();
