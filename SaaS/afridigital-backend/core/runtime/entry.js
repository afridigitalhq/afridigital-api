const { runOrchestrator } = require('./orchestrator');
const { withTimeout } = require('./guard');
const { fallbackBrain } = require('./fallbackBrain');

async function runAI({ userId, text }) {

  const result = await withTimeout(
    runOrchestrator({ userId, text }),
    8000
  );

  if (!result || result.error) {
    return fallbackBrain(text);
  }

  if (result.reply) return result;

  return {
    reply: "Processed",
    raw: result
  };
}

module.exports = { runAI };
