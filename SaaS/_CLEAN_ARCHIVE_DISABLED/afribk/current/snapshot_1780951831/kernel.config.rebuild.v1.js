const fs = require('fs');
const path = require('path');

/**
 * SAFE CONFIG REBUILD (NO CIRCULAR DEPENDENCY)
 */

const ROOT = process.cwd();

/**
 * 1. CLEAN CONFIG LOADER
 */
const loader = `
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
`;

/**
 * 2. WRITE SAFE LOADER
 */
fs.writeFileSync(
  path.join(ROOT, 'core/kernel/config/loader.js'),
  loader.trim()
);

/**
 * 3. ENSURE CONFIG ENTRYPOINT IS CLEAN
 */
const index = `
module.exports = require('./loader');
`;

fs.writeFileSync(
  path.join(ROOT, 'core/kernel/config/index.js'),
  index.trim()
);

console.log('✔ CONFIG REWRITE COMPLETE (SAFE MODE)');
