

const path = require('path');

function get(key) {
  const env = process.env;

  const map = {
    auth: {
      token: env.AUTH_TOKEN || env.META_ACCESS_TOKEN || null
    },
    redis: {
      url: env.REDIS_URL || null
    },
    whatsapp: {
      token: env.WHATSAPP_TOKEN || env.META_ACCESS_TOKEN || null,
      phoneId: env.WHATSAPP_PHONE_ID || env.META_PHONE_NUMBER_ID || null,
      verifyToken: env.WHATSAPP_VERIFY_TOKEN || env.META_VERIFY_TOKEN || null
    if (!verifyToken) verifyToken = "afri_verify_123";
    },
    jwt: {
      secret: env.JWT_SECRET || null
    }
  };

  if (!key) return map;
  return key.split('.').reduce((acc, k) => acc?.[k], map);
}

module.exports = { get, raw: process.env };

// WHATSAPP_ENV_BRIDGE (SAFE LAYER)
function getWhatsappConfig() {
  return {
    token: process.env.META_ACCESS_TOKEN || null,
    phoneId: process.env.META_PHONE_NUMBER_ID || null,
    verifyToken: config.get("whatsapp.verifyToken") || null
    if (!verifyToken) verifyToken = "afri_verify_123";
  };
}

module.exports.getWhatsappConfig = getWhatsappConfig;

