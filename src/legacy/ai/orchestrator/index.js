const classifyIntent = require("../intent.classifier");
const resolveModule = require("../bridge/module.resolver");
const { dispatch } = require("../bridge/action.dispatcher");

const { runEconomyIntelligence } = require("../../economy/intelligence/orchestrator");
const { executeAdjustment } = require("../../economy/policy/adjustment.executor");

const bus = require('../../eventbus');

/**
 * 🧠 SINGLE ENTRYPOINT FOR ALL AI ACTIONS
 */
async function aiOrchestrator(input, context = {}) {

  const traceId = context.traceId || Math.random().toString(36).slice(2);

  // 1. INTENT
  const intent = classifyIntent(input);

  // 2. ROUTE RESOLUTION
  const route = resolveModule(intent);

  // 3. ECONOMY ANALYSIS (optional enrichment layer)
  const economyInsight = runEconomyIntelligence({
    jobs: context.jobs || [],
    services: context.services || [],
    earn: context.earn || []
  });

  // 4. ACTION DISPATCH (market operations)
  const dispatchResult = await dispatch(intent, {
    input,
    traceId
  });

  // 5. POLICY EXECUTION (safe adjustment layer)
  const policyResult = executeAdjustment(
    {
      type: intent,
      target: route?.target || "default",
      value: route?.value || null
    },
    context.marketplace || {}
  );

  // 6. TRACE EMISSION (FlowGraph + Admin panel)
  bus.emit("AI_ORCHESTRATOR_TRACE", {
    traceId,
    input,
    intent,
    route,
    economyInsight,
    dispatchResult,
    policyResult,
    timestamp: Date.now()
  });

  // 7. FINAL RESPONSE
  return {
    ok: true,
    traceId,
    intent,
    route,
    result: dispatchResult,
    policy: policyResult,
    insight: economyInsight
  };
}

module.exports = { aiOrchestrator };
