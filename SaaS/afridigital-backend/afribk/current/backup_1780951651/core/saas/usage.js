const store = {};

function track(apiKey) {
  if (!store[apiKey]) {
    store[apiKey] = {
      count: 0,
      lastRequest: null
    };
  }

  store[apiKey].count += 1;
  store[apiKey].lastRequest = Date.now();

  return store[apiKey];
}

function getAll() {
  return store;
}

module.exports = {
  track,
  getAll
};
