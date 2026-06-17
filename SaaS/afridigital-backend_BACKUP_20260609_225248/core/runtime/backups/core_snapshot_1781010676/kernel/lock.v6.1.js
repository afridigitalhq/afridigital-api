
const infra = require('./infra.adapter.v6.1');

async function acquireLock(key, ttl = 5000) {
  return infra.lock(key, ttl);
}

async function releaseLock(key) {
  return infra.unlock(key);
}

module.exports = {
  acquireLock,
  releaseLock
};

