const fs = require('fs');

const f = 'core/udr-v2.1/start.js';
let c = fs.readFileSync(f, 'utf8');

// remove old boot injections safely
c = c.replace(/boot\\(\\[.*?\\]\\);/gs, '');

// enforce single launcher
if (!c.includes('UDR_BOOT_LAUNCHER')) {

  const launcher = `
const { boot } = require("../udr/boot.registry");

if (!global.__UDR_BOOTED__) {
  global.__UDR_BOOTED__ = true;

  console.log("🚀 UDR BOOT LAUNCHER EXECUTING ONCE");

  boot([
    { name: "trace" },
    { name: "bus" },
    { name: "engine" },
    { name: "fusion" }
  ]);

} else {
  console.log("⚠️ UDR BOOT SKIPPED (GLOBAL LOCK ACTIVE)");
}

// UDR_BOOT_LAUNCHER
`;

  c += launcher;
}

fs.writeFileSync(f, c);
console.log("🔒 UDR v2.4 SAFE PATCH APPLIED");
