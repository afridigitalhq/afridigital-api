const atlas = require("./atlas.core");

function attachNeuralAtlas(bus) {
  console.log("🧠 NEURAL ATLAS ACTIVE");

  bus.on("ROUTE_LEARN", (e) => {
    atlas.registerFlow(
      e.payload?.eventType,
      e.payload?.target,
      true,
      e.payload?.traceId
    );
  });

  bus.on("ROUTE_MISS", (e) => {
    atlas.registerFlow(
      e.payload?.eventType || "unknown",
      "fallback",
      false,
      e.traceId
    );
  });

  bus.on("AI_REQUEST", (e) => {
    atlas.registerNode("AI_CORE");
  });

  bus.on("SYSTEM_ERROR", (e) => {
    atlas.registerFlow("SYSTEM", "ERROR", false, e.traceId);
  });
}

module.exports = { attachNeuralAtlas };
