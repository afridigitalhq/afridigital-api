import { socDashboardAPI } from "../dashboard/SOCDashboardAPI.js";
import { rootCauseAnalyzer } from "../rca/RootCauseAnalyzer.js";

export class CausalGraphEngine {
  build(timeWindowMs = 300000) {
    const snapshot = socDashboardAPI.getLiveSnapshot();
    const rca = rootCauseAnalyzer.analyze(timeWindowMs);

    const events = snapshot.recentEvents || [];

    const nodes = events.map((e) => ({
      id: e.id || `${e.type}-${e.timestamp}`,
      type: e.type,
      severity: e.severity || "LOW",
      timestamp: e.timestamp
    }));

    const edges = [];

    // Build temporal edges
    for (let i = 0; i < events.length - 1; i++) {
      const a = events[i];
      const b = events[i + 1];

      if (b.timestamp - a.timestamp < 5000) {
        edges.push({
          from: a.id || i,
          to: b.id || i + 1,
          type: "TEMPORAL_LINK"
        });
      }
    }

    // Inject RCA hypotheses as causal edges
    for (const h of rca.hypotheses || []) {
      edges.push({
        from: h.chain.from,
        to: h.chain.to,
        type: "CAUSAL_HYPOTHESIS",
        label: h.hypothesis
      });
    }

    return {
      generatedAt: Date.now(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
      nodes,
      edges
    };
  }
}

export const causalGraphEngine = new CausalGraphEngine();
