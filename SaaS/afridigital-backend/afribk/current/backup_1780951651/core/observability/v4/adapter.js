const bus = require("./eventBus");

function bindAdapters() {
  bus.on("http_request", (e) => {
    console.log("🌐 HTTP:", e.traceId, e.path);
  });

  bus.on("worker_event", (e) => {
    console.log("🧠 WORKER:", e.traceId, e.type);
  });

  bus.on("ai_event", (e) => {
    console.log("🤖 AI:", e.traceId, e.model);
  });

  console.log("🚀 Observability adapters active (v4.0)");
}

module.exports = { bindAdapters };
