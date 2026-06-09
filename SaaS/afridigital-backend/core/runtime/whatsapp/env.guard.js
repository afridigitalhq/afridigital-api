function validateWhatsAppEnv() {
  const required = [
    "META_TOKEN",
    "META_PHONE_ID",
    "WHATSAPP_VERIFY_TOKEN"
  ];

  const missing = required.filter(k => !process.env[k]);

  return {
    ok: missing.length === 0,
    missing
  };
}

module.exports = { validateWhatsAppEnv };
