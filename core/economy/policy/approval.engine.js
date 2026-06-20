const bus = require('../../eventbus');

/**
 * Determines if an action is auto-approved, throttled, or queued
 */
function evaluateAction(action) {

  // SAFE UI-LEVEL ACTIONS
  const SAFE = [
    "UI_BOOST",
    "FEED_RANK_UPDATE",
    "NOTIFICATION_PRIORITY"
  ];

  // MEDIUM IMPACT ACTIONS
  const MEDIUM = [
    "JOB_VISIBILITY_BOOST",
    "SERVICE_RANK_ADJUST"
  ];

  // HIGH IMPACT (requires review or delayed execution)
  const HIGH = [
    "NEW_JOB_TEMPLATE",
    "NEW_SERVICE_TEMPLATE",
    "ECONOMY_RULE_CHANGE"
  ];

  let decision = "REJECT";

  if (SAFE.includes(action.type)) {
    decision = "APPROVE_IMMEDIATE";
  }

  if (MEDIUM.includes(action.type)) {
    decision = "APPROVE_THROTTLED";
  }

  if (HIGH.includes(action.type)) {
    decision = "QUEUE_FOR_REVIEW";
  }

  bus.emit("POLICY_DECISION", {
    action,
    decision,
    timestamp: Date.now()
  });

  return decision;
}

module.exports = { evaluateAction };
