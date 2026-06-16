const memory = [];

function store(event) {
  memory.push({
    ...event,
    ts: Date.now()
  });
}

function query(filterFn) {
  return memory.filter(filterFn);
}

function last() {
  return memory[memory.length - 1];
}

module.exports = {
  store,
  query,
  last
};
