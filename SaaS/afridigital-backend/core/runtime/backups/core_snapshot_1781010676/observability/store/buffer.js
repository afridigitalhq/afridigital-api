const MAX = 200;
const events = [];

function push(event) {
  events.push(event);
  if (events.length > MAX) events.shift();
}

function findById(id) {
  return events.filter(e => e.id === id || e.traceId === id);
}

module.exports = { push, findById };
