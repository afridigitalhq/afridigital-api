require("../env-check");

console.log("🧠 BOOT SEQUENCE START");

try {
  const kernel = require("../../core/kernel");

  if (typeof kernel.dispatch !== "function") {
    throw new Error("Kernel dispatch missing");
  }

  kernel.dispatch({
    type: "BOOT_EVENT",
    payload: { status: "starting" }
  });

  console.log("✅ Kernel boot OK");
  console.log("🟢 AfriDigital System Online");

} catch (e) {
  console.error("❌ BOOT FAILED");
  console.error(e.message);
  process.exit(1);
}
