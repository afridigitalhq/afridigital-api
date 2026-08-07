#!/usr/bin/env node

import { execSync } from "child_process";

const command = process.argv[2] || "status";

const commands = {
  verify: "node modules/afrifix/bin/afrifix-verify.js",
  certify: "node modules/afrifix/src/certification/AfriFixCertificationRunner.js",
  ecosystem: "node modules/afrifix/src/certification/AfriFixEcosystemCertification.js",
  validate: "node modules/afrifix/src/certification/AfriFixFullValidation.js",
  pipeline: "node modules/afrifix/bin/afrifix.js",
  status: "node modules/afrifix/bin/afrifix-verify.js"
};

console.log("🛠 AfriFix CLI");
console.log("================");

if (!commands[command]) {
  console.log("Available commands:");
  Object.keys(commands).forEach(cmd => console.log(`- afrifix ${cmd}`));
  process.exit(1);
}

console.log(`▶ Running: ${command}`);

try {
  execSync(commands[command], {
    stdio: "inherit"
  });

  console.log(`\n🟢 AfriFix ${command.toUpperCase()} PASSED`);
} catch {
  console.log(`\n🔴 AfriFix ${command.toUpperCase()} FAILED`);
  process.exit(1);
}
