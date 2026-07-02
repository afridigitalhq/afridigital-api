const { journal, snapshots } = require("./time.state");
const atlas = require("../atlas/atlas.engine");

/**
 * EVENT JOURNAL (append-only history)
 */
function logEvent(event) {
  journal.push({
    ts: Date.now(),
    event
  });
}

/**
 * SNAPSHOT CAPTURE (full state checkpoint)
 */
function snapshot() {
  snapshots.push({
    ts: Date.now(),
    state: JSON.parse(JSON.stringify(atlas.state))
  });
}

/**
 * RECONSTRUCT STATE AT TIME T
 */
function getStateAt(time) {
  let base = { nodes: {}, edges: {} };

  const validSnapshots = snapshots.filter(s => s.ts <= time);
  if (validSnapshots.length) {
    base = JSON.parse(JSON.stringify(validSnapshots[validSnapshots.length - 1].state));
  }

  const events = journal.filter(e => e.ts > (validSnapshots.slice(-1)[0]?.ts || 0) && e.ts <= time);

  for (const e of events) {
    const { type, payload = {} } = e.event;

    const from = payload.from || "system";
    const to = payload.to || type;

    base.nodes[from] = base.nodes[from] || { weight: 0 };
    base.nodes[to] = base.nodes[to] || { weight: 0 };

    base.nodes[from].weight += 1;
    base.nodes[to].weight += 1;

    const key = `${from}->${to}`;
    base.edges[key] = base.edges[key] || { from, to, weight: 0 };
    base.edges[key].weight += 1;
  }

  return base;
}

module.exports = { logEvent, snapshot, getStateAt };
