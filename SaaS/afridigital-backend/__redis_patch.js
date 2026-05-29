const fs = require('fs');
const path = require('path');

const targets = [
  'core/redis.js',
  'core/cache/redis.js',
  'core/memory/redisClient.js'
];

const code = `const { createClient } = require('redis');

if (!process.env.REDIS_URL) {
  throw new Error('❌ REDIS_URL missing in environment (Render config issue)');
}

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
  },
});

client.on('error', (err) => console.error('❌ Redis Error:', err.message));
client.on('connect', () => console.log('🟢 Redis connected (Upstash/Cloud)'));

(async () => {
  await client.connect();
})();

module.exports = client;
`;

for (const f of targets) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, code);
  console.log('patched:', f);
}

console.log('✔ REDIS PATCH DONE');
