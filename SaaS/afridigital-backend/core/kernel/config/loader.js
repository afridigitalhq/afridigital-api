const path = require('path');

function get(key) {
  const env = process.env;

  const map = {
    auth: {
      token: env.AUTH_TOKEN || null
    },
    redis: {
      url: env.REDIS_URL || null
    },
    whatsapp: {
      token: env.WHATSAPP_TOKEN || null
    },
    jwt: {
      secret: env.JWT_SECRET || null
    }
  };

  if (!key) return map;

  return key.split('.').reduce((acc, k) => acc?.[k], map);
}

module.exports = { get, raw: process.env };