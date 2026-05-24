const spine = require("../spine/redis.spine.cjs");
const https = require("https");

const API_URL = process.env.API_URL;

function ping() {
  https.get(API_URL, (res) => {
    const ok = res.statusCode === 200;

    spine.emit(ok ? "RENDER_HEALTH_OK" : "RENDER_HEALTH_FAIL", {
      status: res.statusCode
    });
  }).on("error", () => {
    spine.emit("RENDER_HEALTH_FAIL", {});
  });
}

// heartbeat loop
setInterval(ping, 15000);

console.log("🌐 RENDER SYNC ACTIVE");
