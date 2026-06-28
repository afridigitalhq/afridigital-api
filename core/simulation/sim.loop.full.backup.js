const { getEvents } = require("../event-engine/engine");

let running = false;

function computeField(events) {
  return events.map(e => {
    const heat = (e.score || 0) * 10;
    const velocity = e.status === "critical" ? 3 : 1;
    const mass = 1 + (e.score || 0);

    return {
      ...e,
      physics: { heat, velocity, mass }
    };
  });
}

function startSimulationLoop(broadcast) {
  if (running) return;
  running = true;

  setInterval(() => {
    const events = getEvents(200);
    const field = computeField(events);

    try {
      broadcast({
        type: "FIELD_SNAPSHOT",
        ts: Date.now(),
        data: field
      });
    } catch (e) {}
  }, 20);
}

module.exports = { startSimulationLoop };
