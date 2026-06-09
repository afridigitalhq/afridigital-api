/**
 * 🧠 AFRISCAN RUNTIME HEALTHCHECK
 */

const { scan } = require("../analysis/listener.audit");

function run() {
  const listeners = scan("core");

  console.log("━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🧠 AFRISCAN FINAL HEALTH REPORT");
  console.log("📡 LISTENER COUNT:", listeners);
  console.log("━━━━━━━━━━━━━━━━━━━━━━");

  if (listeners > 2000) {
    console.log("🔴 SYSTEM STILL NOISY (expected pre-cleanup state)");
  } else if (listeners > 500) {
    console.log("🟡 MODERATE NOISE — monitor required");
  } else {
    console.log("🟢 STABLE EVENT LAYER");
  }
}

module.exports = {
  run
};
