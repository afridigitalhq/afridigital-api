export function scrubTimeline(events, index) {
  const slice = events.slice(0, index);

  const state = {
    nodes: {},
    alerts: [],
    time: index
  };

  slice.forEach(e => {
    if (e.type === "NODE_UPDATE") {
      state.nodes[e.node] = e;
    }

    if (e.type === "ALERT") {
      state.alerts.push(e);
    }
  });

  return {
    snapshot: state,
    mode: "TIME_TRAVEL_VIEW"
  };
}
