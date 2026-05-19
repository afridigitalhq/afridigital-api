const { assertApiVersion } = require("../runtime/safety/api.guard");
const { storeMemory, recallMemory } = require("../../services/vector/vectorMemory");

async function neuralMemoryPipeline({ userId, message, response, channel }) {
  await storeMemory({ userId, message, response, channel });
  return true;
}

async function memoryRecallPipeline({ userId, message }) {
  const mem = await recallMemory({ userId, message });
  return mem;
}

module.exports = { neuralMemoryPipeline, memoryRecallPipeline };
