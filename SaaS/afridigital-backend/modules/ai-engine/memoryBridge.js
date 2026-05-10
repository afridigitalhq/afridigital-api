const { memoryRecallPipeline, neuralMemoryPipeline } = require("../../services/memory/neuralMemory");

async function enrichWithMemory({ userId, message }) {
  const mem = await memoryRecallPipeline({ userId, message });

  if (!mem) return message;

  return `Context: ${mem.message} -> ${mem.response}\n\nUser: ${message}`;
}

async function storeAIInteraction({ userId, message, response, channel }) {
  await neuralMemoryPipeline({ userId, message, response, channel });
}

module.exports = { enrichWithMemory, storeAIInteraction };
