const bus = require('../../eventbus');
const { evaluateAction } = require("./approval.engine");

/**
 * Applies approved adjustments to marketplace state
 */
function executeAdjustment(action, marketplace) {

  const decision = evaluateAction(action);

  if (decision === "APPROVE_IMMEDIATE") {

    marketplace[action.target] = action.value;

    bus.emit("MARKETPLACE_UPDATED", {
      type: action.type,
      target: action.target,
      value: action.value
    });

    return { status: "APPLIED" };
  }

  if (decision === "APPROVE_THROTTLED") {

    setTimeout(() => {
      marketplace[action.target] = action.value;

      bus.emit("MARKETPLACE_UPDATED_THROTTLED", {
        type: action.type,
        target: action.target,
        value: action.value
      });
    }, 2000);

    return { status: "THROTTLED_QUEUE" };
  }

  if (decision === "QUEUE_FOR_REVIEW") {

    bus.emit("MARKETPLACE_REVIEW_QUEUE", {
      action
    });

    return { status: "QUEUED_FOR_REVIEW" };
  }

  return { status: "REJECTED" };
}

module.exports = { executeAdjustment };
