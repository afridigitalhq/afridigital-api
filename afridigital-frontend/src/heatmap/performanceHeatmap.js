export function buildHeatmap(events) {
  const heat = {};

  for (const e of events) {
    if (!heat[e.node]) {
      heat[e.node] = { load: 0, failures: 0, latency: 0 };
    }

    heat[e.node].load += e.execLoad || 1;
    heat[e.node].failures += e.status === "FAILED" ? 1 : 0;
    heat[e.node].latency += e.latency || 0;
  }

  Object.keys(heat).forEach(k => {
    const h = heat[k];
    h.score =
      (h.load * 0.4) +
      (h.failures * 0.4) +
      (h.latency / 1000);
  });

  return heat;
}
