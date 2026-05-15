/**
 * 🧠 AFRIDIGITAL TIME MACHINE ENGINE (A3.5)
 * Replay + timeline + AI event reconstruction
 */

const { getHistory } = require("../runtime/bus/event.bus");

function replay({ limit = 50 } = {}) {
  const history = getHistory();

  return {
    status: "OK",
    mode: "TIME_MACHINE_REPLAY",
    totalEvents: history.length,
    replay: history.slice(-limit)
  };
}

function traceByType(type) {
  const history = getHistory();
  return history.filter(e => e.type === type);
}

function reconstructTimeline() {
  const history = getHistory();

  return history.map((e, i) => ({
    step: i + 1,
    id: e.id,
    type: e.type,
    ts: e.ts
  }));
}

module.exports = {
  replay,
  traceByType,
  reconstructTimeline
};
