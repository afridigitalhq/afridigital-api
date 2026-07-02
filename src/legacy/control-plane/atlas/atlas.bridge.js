const atlas = require("./atlas.engine");
const bus = require("../../runtime/event.bus");

/**
 * CONNECT ATLAS TO SYSTEM BUS
 */
function attachAtlas() {
  console.log("🧠 NEURAL ROUTING ATLAS ACTIVE");

  bus.on("HTTP_REQUEST", (e) => atlas.ingest({
    type: "HTTP_REQUEST",
    payload: { from: e.path, to: e.method }
  }));

  bus.on("AI_REQUEST", (e) => atlas.ingest({
    type: "AI_REQUEST",
    payload: { from: "ai", to: "llm" }
  }));

  bus.on("SYSTEM_ERROR", (e) => atlas.ingest({
    type: "SYSTEM_ERROR",
    payload: { from: "system", to: "error" }
  }));

  bus.on("ROUTE_LEARN", (e) => atlas.ingest({
    type: "ROUTE_LEARN",
    payload: { from: "router", to: e.payload?.eventType || "route" }
  }));
}

module.exports = { attachAtlas };
