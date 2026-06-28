const { getEvents } = require("../event-engine/engine");

let prev = new Map();

function computeField(events) {
  return events.map(e => {
    const heat = (e.score || 0) * 10;
    const velocity = e.status === "critical" ? 3 : 1;
    const mass = 1 + (e.score || 0);

    return {
      id: e.id,
      physics: { heat, velocity, mass }
    };
  });
}

function diff(prevMap, current) {
  const nextMap = new Map();
  const added = [];
  const updated = [];

  for (const node of current) {
    nextMap.set(node.id, node);

    if (!prevMap.has(node.id)) {
      added.push(node);
    } else {
      updated.push(node);
    }
  }

  return { nextMap, added, updated };
}

  setInterval(() => {
    const events = getEvents(200);
    const current = computeField(events);

    const { nextMap, added, updated } = diff(prev, current);
    prev = nextMap;

    broadcast({
      type: "FIELD_DIFF",
      ts: Date.now(),
      added,
      updated
    });

  }, 20);
}

