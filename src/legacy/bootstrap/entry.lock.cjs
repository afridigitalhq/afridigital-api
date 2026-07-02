console.log("🚪 AFRI ENTRY LOCK ACTIVE");

require("./loader.cjs");

const entry = require("../index.js");

if (global.__AFRI_BOOTED__) {
  console.warn("⚠️ Duplicate boot attempt blocked");
} else {
  global.__AFRI_BOOTED__ = true;
}
