const { safeExecute } = require('../tools/safeExecutor');

async function executeToolChain(userId, steps = []) {
  const results = [];

  let lastOutput = null;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    // inject previous output into args if needed
    const args = {
      ...step.args,
      previous: lastOutput
    };

    console.log(`🔗 Executing step ${i + 1}:`, step.tool);

    const result = await safeExecute(
      userId,
      step.tool,
      args
    );

    results.push({
      step: i + 1,
      tool: step.tool,
      result
    });

    lastOutput = result;
  }

  return results;
}

module.exports = {
  executeToolChain
};
