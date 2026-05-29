const { safeExecute } = require('../tools/safeExecutor');

function evaluateCondition(condition, context) {
  try {
    // simple safe evaluation model (no eval())
    const { toolResult, userMessage } = context;

    if (condition === "tool_failed") {
      return toolResult && toolResult.ok === false;
    }

    if (condition === "tool_success") {
      return toolResult && toolResult.ok === true;
    }

    if (condition === "contains_pricing") {
      return (userMessage || "").includes("price");
    }

    if (condition === "contains_support") {
      return (userMessage || "").includes("help");
    }

    return false;

  } catch (err) {
    return false;
  }
}

async function executeConditionalFlow(userId, flow, context) {
  const results = [];

  for (const step of flow.steps || []) {

    const conditionMet =
      evaluateCondition(step.if, context);

    console.log(
      `🌿 CONDITION ${step.if} → ${conditionMet}`
    );

    let executed = null;

    if (conditionMet && step.then) {

      executed = await safeExecute(
        userId,
        step.then.tool,
        step.then.args || {}
      );

    } else if (step.else) {

      executed = await safeExecute(
        userId,
        step.else.tool,
        step.else.args || {}
      );
    }

    results.push({
      condition: step.if,
      executed
    });
  }

  return results;
}

module.exports = {
  executeConditionalFlow
};
