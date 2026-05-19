const fs = require("fs");

const dist = fs.readFileSync("dist/index.html", "utf8").toLowerCase();

const rules = {
  hero: /class="[^"]*hero/,
  marquee: /class="[^"]*marquee|animate-scroll|whitespace-nowrap/,
  auth: /class="[^"]*auth/,
  services: /our services/,
  footer: /<footer/,
  chat: /chat/
};

for (const k in rules) {
  if (!rules[k].test(dist)) {
    console.error("❌ TRUTH LOCK FAILED:", k);
    process.exit(1);
  }
}

if (dist.includes("src/partials")) {
  console.error("❌ TRUTH LOCK FAILED: partial leakage detected");
  process.exit(1);
}

console.log("🔒 TRUTH LOCK: PASSED (UI + Build + Source integrity OK)");
