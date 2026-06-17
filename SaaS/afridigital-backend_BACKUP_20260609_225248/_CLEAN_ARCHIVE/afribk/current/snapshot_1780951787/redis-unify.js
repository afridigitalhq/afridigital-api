const fs = require('fs');

const master = `
const { createClient } = require("redis");

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL missing");
}

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
  }
});

client.on("connect", () => {
  console.log("🟢 Redis connected");
});

client.on("error", (err) => {
  console.log("🔴 Redis error:", err.message);
});

(async () => {
  if (!client.isOpen) await client.connect();
})();

module.exports = client;
`;

fs.writeFileSync('core/redisClient.js', master);

[
  'core/memory/redisClient.js',
  'core/redis.js',
  'core/cache/redis.js',
  'core/redis/client.js',
  'core/africore/runtime/redis.js'
].forEach(f => {
  const depth = f.split('/').length - 2;
  const rel = '../'.repeat(depth) + 'redisClient';
  fs.writeFileSync(f, `module.exports = require("${rel}");\n`);
  console.log('unified:', f);
});

console.log('✅ REDIS UNIFIED');
