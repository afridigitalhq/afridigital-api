const bus = require("../../runtime/event.bus");
const time = require("./time.engine");

/**
 * CONNECT TIME SYSTEM TO ATLAS + BUS
 */
function attachTimeTravel() {
  console.log("🔮 TIME TRAVEL MODE ACTIVE");

  // log everything
  bus.onAny?.((type, payload) => {
    time.logEvent({ type, payload });
  });

  // periodic snapshots
  setInterval(() => {
    time.snapshot();
  }, 5000);
}

module.exports = { attachTimeTravel };
