/**
 * 🔁 SELF-HEALING LOOP (A3.11)
 */

const { runHealingCycle } = require("./brain");

function startHealing(interval = 7000) {
  setInterval(() => {
    const result = runHealingCycle();
    console.log("🧠 HEALING CHECK:", result.status);
  }, interval);

  console.log("⚙️ SELF-HEALING ENGINE ONLINE");
}

module.exports = { startHealing };
