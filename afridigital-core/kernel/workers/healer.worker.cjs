const stream = require("../streams/redis.stream.cjs");

console.log("🛠️ AUTO-HEAL WORKER ONLINE");

stream.consume((event, payload) => {

  if (event === "RENDER_HEALTH_FAIL") {
    console.log("⚠️ Healing Render node...");
  }

  if (event === "SERVICE_CRASH") {
    console.log("🔁 Restart signal issued:", payload.service);
  }

});
