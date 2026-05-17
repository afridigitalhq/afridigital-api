const store = {};

module.exports = {
  get: (user) => store[user] || [],
  push: (user, data) => {
    if (!store[user]) store[user] = [];
    store[user].push(data);

    // keep last 20 messages only
    if (store[user].length > 20) {
      store[user].shift();
    }
  }
};
