const bus = require("./event.bus");

function startLiveStream() {

  bus.subscribe("live.route", (data) => {
    console.log("📡 LIVE INTELLIGENCE EVENT:", {
      user: data.msg.from,
      route: data.routing?.decision?.route,
      confidence: data.routing?.decision?.confidence
    });
  });

  console.log("⚡ Live stream observer active");
}

module.exports = { startLiveStream };
