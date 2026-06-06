/**
 * 🔥 Insight-to-Execution Pipeline
 * (Rank → Approve → Execute Safe Commit Flow)
 */

const { getRankedInsights } = require("../insight-ranking-engine");
const { executeAction } = require("../../admin/execution-pipeline");
const { createSnapshot } = require("../../admin/snapshots");

/**
 * 🧠 Build execution queue from ranked insights
 */
function buildExecutionQueue(systemState) {

  const insights = getRankedInsights().ranked;

  return insights.map((insight, index) => {

    return {
      id: index,
      insight: insight.recommendation,
      score: insight.score,
      priority:
        insight.score > 80
          ? "HIGH"
          : insight.score > 50
          ? "MEDIUM"
          : "LOW",

      status: "PENDING_APPROVAL"
    };
  });
}

/**
 * ⚙️ Execute approved insight safely
 */
function executeInsight(systemState, insight, approved = false) {

  if (!approved) {
    return {
      status: "BLOCKED",
      reason: "INSIGHT_NOT_APPROVED"
    };
  }

  // STEP 1: snapshot before execution
  const snapshotId = createSnapshot(systemState);

  // STEP 2: convert insight → action
  const action = {
    type: "MARKET_OPTIMIZATION",
    value: insight.score
  };

  // STEP 3: execute via execution engine
  const result = executeAction(systemState, action);

  return {
    status: "EXECUTED",
    snapshotId,
    result
  };
}

/**
 * 🧠 FULL PIPELINE OUTPUT
 */
function runPipeline(systemState) {

  const queue = buildExecutionQueue(systemState);

  return {
    queue,
    totalItems: queue.length,
    readyForApproval: queue.filter(q => q.priority === "HIGH")
  };
}

module.exports = {
  buildExecutionQueue,
  executeInsight,
  runPipeline
};
