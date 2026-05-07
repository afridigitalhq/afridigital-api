const https = require("https");
const stream = require("../streams/redis.stream.cjs");

const API_URL = process.env.API_URL;

function ping() {
  https.get(API_URL, (res) => {
    const ok = res.statusCode === 200;

    stream.emit(ok ? "RENDER_HEALTH_OK" : "RENDER_HEALTH_FAIL", {
      code: res.statusCode
    });
  }).on("error", () => {
    stream.emit("RENDER_HEALTH_FAIL", {});
  });
}

setInterval(ping, 15000);

console.log("🌐 V14 GLOBAL RENDER SYNC ACTIVE");
