const store = new Map();

function track(key, payload) {
  const prev = store.get(key) || [];
  prev.push({
    ts: Date.now(),
    provider: payload.provider,
    usageKey: payload.usageKey
  });
  store.set(key, prev);
}

function getAll() {
  return Object.fromEntries(store);
}

module.exports = { track, getAll };
