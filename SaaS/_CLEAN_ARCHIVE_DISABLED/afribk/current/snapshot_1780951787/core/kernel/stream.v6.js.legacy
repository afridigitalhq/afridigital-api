
const listeners = [];

function emit(event) {
  for (const fn of listeners) fn(event);
}

function subscribe(fn) {
  listeners.push(fn);
}

module.exports = { emit, subscribe };

