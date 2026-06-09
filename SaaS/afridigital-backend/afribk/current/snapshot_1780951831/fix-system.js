const fs = require('fs');

function patch(file, content) {
  fs.writeFileSync(file, content);
  console.log('patched:', file);
}

// SAFE REDIS ENTRY POINT
patch('core/redisClient.js', `
const { createClient } = require('redis');

if (!process.env.REDIS_URL) {
  console.warn('⚠️ Redis missing → mock mode');
  module.exports = {
    connect: async () => {},
    get: async () => null,
    set: async () => null,
    on: () => {}
  };
  return;
}

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: r => Math.min(r * 50, 2000)
  }
});

client.on('error', e => console.log('❌ Redis:', e.message));
client.on('connect', () => console.log('🟢 Redis connected'));

(async () => {
  await client.connect();
})();

module.exports = client;
`);

// UNIFY ALL REDIS IMPORTS
[
  'core/memory/redisClient.js',
  'core/redis.js',
  'core/cache/redis.js',
  'core/redis/client.js',
  'core/africore/runtime/redis.js'
].forEach(f => {
  patch(f, 'module.exports = require(\"../../redisClient\");');
});

console.log('✅ SYSTEM FIX COMPLETE');
