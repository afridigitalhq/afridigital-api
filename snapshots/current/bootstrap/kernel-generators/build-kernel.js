const { execSync } = require("child_process");

const steps = [
  "generate-kernel-gate.js",
  "generate-kernel-bootstrap.js",
  "generate-kernel-index.js"
];

console.log("🧠 AFRIDIGITAL KERNEL BUILD");
console.log("================================");

for (const step of steps) {
  console.log(`▶ ${step}`);
  execSync(`node bootstrap/kernel-generators/${step}`, { stdio: "inherit" });
  execSync(`node --check bootstrap/kernel-generators/${step}`, { stdio: "inherit" });
  console.log(`✅ ${step} OK\n`);
}

console.log("================================");
console.log("✅ KERNEL GENERATOR PIPELINE READY");
console.log("Production kernel files have NOT been modified.");
