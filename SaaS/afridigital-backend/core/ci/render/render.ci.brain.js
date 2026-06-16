const EventEmitter = require("events");
const { emit } = require("../telemetry");

/**
 * 🧠 RENDER CI BRAIN
 * Converts deploy lifecycle events → AFRISCAN graph events
 */

class RenderCIBrain extends EventEmitter {
  constructor() {
    super();
    this.queue = [];
  }

  normalize(event) {
    return {
      type: "render_ci_log",
      payload: {
        service: event.service || "unknown",
        status: event.status || "info",
        message: event.message || "",
        commit: event.commit || null,
        branch: event.branch || "main"
      },
      ts: Date.now()
    };
  }

  ingest(event) {
    const normalized = this.normalize(event);

    // 📡 push into AFRISCAN telemetry stream
    emit(normalized.type, normalized.payload);

    // 🧠 local buffer (future replay / debugging)
    this.queue.push(normalized);

    console.log("🧠 CI EVENT:", normalized);
  }

  // 🔗 Render webhook entrypoint
  handleRenderWebhook(req, res) {
    try {
      const event = req.body;

      this.ingest({
        service: "render",
        status: event.type,
        message: event.msg || event.message,
        commit: event.commit,
        branch: event.branch
      });

      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RenderCIBrain();
