const { boot } = require("../udr/boot.registry");

console.log("🚀 UDR START ENTRY (STRICT MODE v2.5)");

global.__UDR_BOOT_LOCK__ = global.__UDR_BOOT_LOCK__ || {
  active: false,
  cycleId: null,
  expiresAt: 0
};

const now = Date.now();
const lock = global.__UDR_BOOT_LOCK__;
const expired = now > lock.expiresAt;

if (!lock.active || expired) {

  lock.active = true;
  lock.cycleId = "cycle_" + now;
  lock.expiresAt = now + 5000;

  const result = boot([
    { name: "trace" },
    { name: "bus" },
    { name: "engine" },
    { name: "fusion" }
  ]);

  console.log("🧾 BOOT RESULT:", result);

} else {
  console.log("⚠️ UDR BOOT SKIPPED (LOCK ACTIVE)", lock);
}
