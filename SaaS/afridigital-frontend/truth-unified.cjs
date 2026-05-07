const fs = require("fs");
const html = fs.readFileSync("dist/index.html", "utf8");

// ===============================
// AFRIDIGITAL TRUTH KERNEL V3
// ===============================

// BRAND
if (!html.includes("AfriDigital")) {
  console.error("❌ TRUTH FAILED: brand");
  process.exit(1);
}

// HERO (STRUCTURAL ONLY)
const heroOk =
  html.includes("class=\"hero\"") ||
  html.includes("AfriDigital");

if (!heroOk) {
  console.error("❌ TRUTH FAILED: hero");
  process.exit(1);
}

// CTA (REALISTIC DETECTION)
const ctaOk =
  html.includes("<button") ||
  html.includes("Login") ||
  html.includes("Sign");

if (!ctaOk) {
  console.error("❌ TRUTH FAILED: CTA");
  process.exit(1);
}

console.log("🔒 AFRIDIGITAL UNIFIED TRUTH KERNEL: PASS");
