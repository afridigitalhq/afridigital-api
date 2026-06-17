const store = new Map();

function setReply(id, data) {
  store.set(id, data);
}

function getReply(id) {
  return store.get(id) || null;
}

function waitForReply(id, timeout = 5000) {
  return new Promise((resolve) => {
    const start = Date.now();

    const interval = setInterval(() => {
      if (store.has(id)) {
        clearInterval(interval);
        return resolve(store.get(id));
      }

      if (Date.now() - start > timeout) {
        clearInterval(interval);
        resolve(null);
      }
    }, 50);
  });
}

module.exports = { setReply, getReply, waitForReply };
