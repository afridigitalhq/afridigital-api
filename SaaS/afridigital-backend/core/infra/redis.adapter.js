
let redis = null;

function init(client) {
  redis = client;
}

// safe wrapper (never throws system)
async function get(key) {
  if (!redis) return null;
  return redis.get?.(key);
}

async function set(key, value, ttl) {
  if (!redis) return false;
  if (ttl) return redis.set?.(key, value, 'EX', ttl);
  return redis.set?.(key, value);
}

async function lpush(key, value) {
  if (!redis) return false;
  return redis.lPush?.(key, value);
}

async function lrange(key, start, end) {
  if (!redis) return [];
  return redis.lRange?.(key, start, end);
}

module.exports = {
  init,
  get,
  set,
  lpush,
  lrange
};

