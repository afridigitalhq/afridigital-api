const store = {};

function get(key) {
  return store[key] || null;
}

function set(key, value) {
  store[key] = value;
}

function incr(key) {
  store[key] = (store[key] || 0) + 1;
  return store[key];
}

module.exports = { get, set, incr };
