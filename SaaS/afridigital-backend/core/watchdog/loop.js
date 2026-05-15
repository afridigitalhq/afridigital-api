/**
 * 🔁 WATCHDOG AUTO LOOP (A3.10)
 */

const { analyzeSystem } = require("./brain");
const { triggerAlert } = require("./alert.engine");

function startWatchdog(interval = 5000) {
  setInterval(() => {
    const decision = analyzeSystem();
    triggerAlert(decision);
  }, interval);

  console.log("🐕 WATCHDOG AI BRAIN ONLINE");
}

module.exports = { startWatchdog };
