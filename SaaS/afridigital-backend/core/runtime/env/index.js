require("dotenv").config();

const ENV = {
  META_TOKEN: process.env.META_TOKEN,
  META_PHONE_ID: process.env.META_PHONE_ID,
  WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
  PORT: process.env.PORT || 9090
};

function assertEnv() {
  const missing = Object.entries(ENV)
    .filter(([k, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    console.error("❌ MISSING ENV:", missing.join(", "));
  }

  return ENV;
}

module.exports = {
  ENV,
  assertEnv
};
