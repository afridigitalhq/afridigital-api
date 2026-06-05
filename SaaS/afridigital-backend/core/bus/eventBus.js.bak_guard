const queue = [];

function emit(event) {
  queue.push(event);
}

function next() {
  return queue.shift();
}

function hasEvents() {
  return queue.length > 0;
}

module.exports = { emit, next, hasEvents };
