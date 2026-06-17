export function replaySystem(events, timestamp) {
  const state = {
    nodes: {},
    timeline: []
  };

  const filtered = events.filter(e => e.ts <= timestamp);

  for (const e of filtered) {
    state.timeline.push(e);

    if (e.type === "NODE_UPDATE") {
      state.nodes[e.node] = e;
    }

    if (e.type === "FAILURE") {
      state.nodes[e.node] = {
        ...state.nodes[e.node],
        status: "FAILED"
      };
    }
  }

  return {
    snapshot: state,
    mode: "DIGITAL_TWIN_REPLAY",
    timestamp
  };
}
