const store = [];

function save(vector) {
  store.push(vector);
}

function all() {
  return store;
}

module.exports = { save, all };
