/**
 * 🧠 A3.17 REASONING GRAPH ENGINE
 * Converts AI decisions into tree structure
 */

function buildReasoningGraph(proposal) {

  return {
    root: proposal.id,
    nodes: [
      {
        id: "risk",
        label: "Risk Evaluation",
        value: proposal.riskScore
      },
      {
        id: "impact",
        label: "System Impact",
        value: proposal.impact
      },
      {
        id: "watchdog",
        label: "Watchdog Verdict",
        value: proposal.riskScore > 0.7 ? "BLOCK" : "ALLOW"
      }
    ],
    edges: [
      ["risk", "watchdog"],
      ["impact", "watchdog"]
    ]
  };
}

module.exports = { buildReasoningGraph };
