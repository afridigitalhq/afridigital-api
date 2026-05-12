const { assertApiVersion } = require("../runtime/safety/api.guard");
const { assertNoSimulation } = require("../runtime/safety/execution.mode");
async function messageBrain({ from, message }) {

  console.log('🧠 BRAIN INPUT:', from, message);

  try {

    const { assertNoSimulation } = require("../safety/execution.mode"); assertNoSimulation("brain.message", "runtime"); // SAFE FALLBACK PROTECTED
    return {
      reply: '👋 Welcome to AfriDigital AI (safe mode active)'
    };

  } catch (err) {

    console.error('❌ BRAIN ERROR:', err);

    return {
      reply: '⚠️ Brain temporarily unavailable'
    };

  }
}

module.exports = { messageBrain };
assertNoSimulation(runtimeResponse, 'brain.message.runtime');
