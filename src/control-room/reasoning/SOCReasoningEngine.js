import { rootCauseAnalyzer } from "../rca/RootCauseAnalyzer.js";
import { socGlobalMemoryIndex } from "../memory/SOCGlobalMemoryIndex.js";
import { causalGraphEngine } from "../graph/CausalGraphEngine.js";
import { socSimulationEngine } from "../simulation/SOCSimulationEngine.js";

export class SOCReasoningEngine {
  reason(timeWindowMs = 300000) {

    const rca = rootCauseAnalyzer.analyze(timeWindowMs);
    const memory = socGlobalMemoryIndex.getFullMemory();
    const graph = causalGraphEngine.build(timeWindowMs);
    const simulation = socSimulationEngine.runScenario({ timeWindowMs });

    const insights = [];

    // 1. Pattern-based reasoning
    for (const h of rca.hypotheses || []) {
      const match = memory.find((m) => m.pattern === h.hypothesis);

      insights.push({
        type: "PATTERN_MATCH",
        hypothesis: h.hypothesis,
        frequency: match?.totalOccurrences || 0,
        confidence: match ? Math.min(0.95, 0.5 + match.totalOccurrences * 0.05) : 0.4
      });
    }

    // 2. Graph density reasoning
    const graphComplexity = (graph.nodeCount + graph.edgeCount) / 100;

    insights.push({
      type: "SYSTEM_COMPLEXITY",
      score: graphComplexity,
      interpretation:
        graphComplexity > 5
          ? "High systemic coupling detected"
          : "Normal operational coupling"
    });

    // 3. Simulation divergence reasoning
    insights.push({
      type: "SIMULATION_DELTA",
      result: simulation.result?.chainsDetected || 0,
      interpretation:
        simulation.result?.chainsDetected > rca.chainsDetected
          ? "System is sensitive to parameter changes"
          : "Stable causal structure"
    });

    // 4. Action recommendations (NON-EXECUTING)
    const recommendations = rca.hypotheses.map((h) => {
      if (h.hypothesis.includes("STREAM")) {
        return { action: "RESTART_STREAM", confidence: 0.7 };
      }

      if (h.hypothesis.includes("ALERT")) {
        return { action: "ESCALATE_INCIDENT", confidence: 0.6 };
      }

      if (h.hypothesis.includes("LOAD")) {
        return { action: "OPTIMIZE_DISTRIBUTION", confidence: 0.65 };
      }

      return { action: "NO_ACTION", confidence: 0.3 };
    });

    return {
      timestamp: Date.now(),
      rca,
      graphSummary: {
        nodes: graph.nodeCount,
        edges: graph.edgeCount
      },
      simulationSummary: simulation.result,
      insights,
      recommendations
    };
  }
}

export const socReasoningEngine = new SOCReasoningEngine();
