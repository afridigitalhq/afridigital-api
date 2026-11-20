const AfriIntelCorrelationEngine = {
  correlate(evidence = []) {
    if (!Array.isArray(evidence)) throw new Error("AFRI_INTEL_EVIDENCE_LIST_INVALID");

    const groups = new Map();
    for (const item of evidence) {
      if (!item || typeof item.url !== "string") continue;
      let key;
      try {
        const url = new URL(item.url);
        url.hash = "";
        key = url.href;
      } catch {
        continue;
      }

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }

    return [...groups.entries()].map(([url, records]) => ({
      url,
      occurrences: records.length,
      sourceIds: [...new Set(records.map(item => item.sourceId).filter(Boolean))],
      evidence: records
    }));
  }
};

export default AfriIntelCorrelationEngine;
