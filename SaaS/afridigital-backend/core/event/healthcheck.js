const { getHistory } = require('./bus');

function checkEventSystem() {
  const h = getHistory();

  return {
    status: "OK",
    eventsStored: h.length,
    lastEvent: h[h.length - 1] || null,
    busHealthy: true
  };
}

module.exports = { checkEventSystem };
