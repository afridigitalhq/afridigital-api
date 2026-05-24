const fs = require("fs");

const html = fs.readFileSync("dist/index.html", "utf8").toLowerCase();

const contract = {
  hero: /class="[^"]*hero/,
  marquee: /class="[^"]*marquee|animate-scroll|whitespace-nowrap/,
  auth: /class="[^"]*auth/,
  services: /our services/,
  footer: /<footer/,
  chat: /chat/
};

for (const key in contract) {
  if (!contract[key].test(html)) {
    console.error("❌ DOM CONTRACT FAILED:", key);
    process.exit(1);
  }
}

console.log("✅ DOM CONTRACT ENFORCER: PASS");
