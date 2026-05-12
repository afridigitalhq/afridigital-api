const store = new Map();

function key(txId, userId, action) {
  return `${txId}:${userId}:${action}`;
}

function check(txId, userId, action) {
  const k = key(txId, userId, action);
  if (store.has(k)) return true;
  store.set(k, Date.now());
  return false;
}

module.exports = { check };
