const { getHistory } = require('../bus');

function replay(filter = {}) {
  const events = getHistory();

  return events.filter(e => {
    if (filter.type && e.type !== filter.type) return false;
    if (filter.from && e.ts < filter.from) return false;
    if (filter.to && e.ts > filter.to) return false;
    return true;
  });
}

function replayById(id) {
  return getHistory().find(e => e.id === id);
}

module.exports = { replay, replayById };
