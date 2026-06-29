console.log("🧠 SYSTEM VALIDATION START");

const checks = [
  "../env-check",
  "../../core/kernel",
  "../../core/router"
];

for (const c of checks) {
  try {
    require(c);
    console.log("✅ OK:", c);
  } catch (e) {
    console.log("❌ FAIL:", c);
    console.error(e.message);
    process.exit(1);
  }
}

console.log("🟢 ALL SYSTEMS VALID");
