
require('dotenv').config();
const { createClient } = require('redis');

const url = process.env.REDIS_URL;

const client = createClient({
  url,
  socket: {
    reconnectStrategy: (r) => Math.min(r * 50, 2000)
  }
});

client.on('error', (e) => console.log('Redis error:', e.message));
client.on('connect', () => console.log('🟢 Redis connected'));

(async () => {
  try {
    if (url) await client.connect();
  } catch (e) {
    console.log('❌ Redis degraded mode');
  }
})();

module.exports = client;
