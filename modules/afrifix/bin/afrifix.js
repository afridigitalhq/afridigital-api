#!/usr/bin/env node

import { execSync } from "child_process";

console.log("🛠 AfriFix Universal Command Runner");
console.log("================================");

const steps = [
  {
    name: "Capability Validation",
    command: "node modules/afrifix/src/certification/AfriFixFullValidation.js"
  },
  {
    name: "Certification",
    command: "node modules/afrifix/src/certification/AfriFixCertificationRunner.js"
  },
  {
    name: "Ecosystem Certification",
    command: "node modules/afrifix/src/certification/AfriFixEcosystemCertification.js"
  },
  {
    name: "Universal Verification",
    command: "node modules/afrifix/bin/afrifix-verify.js"
  }
];

for (const step of steps) {
  console.log(`\n▶ ${step.name}`);
  try {
    execSync(step.command, { stdio: "inherit" });
    console.log(`✅ ${step.name} PASSED`);
  } catch (error) {
    console.log(`❌ ${step.name} FAILED`);
    process.exit(1);
  }
}

console.log("\n================================");
console.log("🟢 AfriFix OPERATIONAL PIPELINE PASSED");
