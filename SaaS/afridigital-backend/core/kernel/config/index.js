const env = process.env;

/**
 * SINGLE SOURCE OF TRUTH CONFIG REGISTRY
 * All runtime systems MUST use this file
 */

const config = {
  env: env.NODE_ENV || "development",

  redis: {
    url: env.REDIS_URL || null,
    enabled: !!env.REDIS_URL
  },

  meta: {
    token: env.META_ACCESS_TOKEN || null,
    phoneId: env.META_PHONE_NUMBER_ID || null,
    verifyToken: env.META_VERIFY_TOKEN || null,

    enabled: !!(env.META_ACCESS_TOKEN && env.META_PHONE_NUMBER_ID)
  },

  whatsapp: {
    // backward compatibility layer only (deprecated)
    token: env.META_ACCESS_TOKEN || env.WHATSAPP_TOKEN || null,
    phoneId: env.META_PHONE_NUMBER_ID || env.WHATSAPP_PHONE_ID || null
  },

  a2: {
    locked: true,
    mode: "PRODUCTION_LOCKED"
  }
};

module.exports = config;
