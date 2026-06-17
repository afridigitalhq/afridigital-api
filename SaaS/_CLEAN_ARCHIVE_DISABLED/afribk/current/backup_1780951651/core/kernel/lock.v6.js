
const locks = new Map();

async function acquire(key, ttl = 5000) {
  if (locks.has(key)) return false;
  locks.set(key, Date.now() + ttl);

  setTimeout(() => {
    if (locks.get(key) < Date.now()) locks.delete(key);
  }, ttl);

  return true;
}

async function release(key) {
  locks.delete(key);
}

module.exports = { acquire, release };

