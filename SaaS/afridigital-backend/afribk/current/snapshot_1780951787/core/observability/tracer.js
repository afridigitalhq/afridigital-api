const logs = [];

/**
 * 🧾 SIMPLE TRACE SYSTEM
 */
function trace(event, data) {
  logs.push({
    event,
    data,
    time: Date.now()
  });
}

function getTraces() {
  return logs;
}

module.exports = { trace, getTraces };
