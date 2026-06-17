export function compareTimelines(base, variant) {
  const diff = {
    addedEvents: [],
    removedEvents: [],
    changedLatency: []
  };

  const baseMap = new Map(base.map(e => [e.id, e]));
  const variantMap = new Map(variant.map(e => [e.id, e]));

  for (const [id, e] of variantMap) {
    if (!baseMap.has(id)) diff.addedEvents.push(e);
  }

  for (const [id, e] of baseMap) {
    if (!variantMap.has(id)) diff.removedEvents.push(e);
  }

  for (const [id, e] of variantMap) {
    if (baseMap.has(id)) {
      const b = baseMap.get(id);
      if (b.latency !== e.latency) {
        diff.changedLatency.push({
          id,
          before: b.latency,
          after: e.latency
        });
      }
    }
  }

  return {
    diff,
    mode: "A_B_TIMELINE_COMPARISON"
  };
}
