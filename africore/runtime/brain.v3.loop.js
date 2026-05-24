const memory = require("./brain.v2.memory");
const vector = require("./brain.v3.vector");
const llm = require("./brain.v3.llm");
const router = require("./brain.v2.router");

async function cognitiveStep(user, message) {

  // 1. store raw memory
  await memory.storeMessage(user, message);

  // 2. store vector memory
  await vector.storeVector(user, message);

  // 3. retrieve context
  const context = await router.buildContext(user, message);

  // 4. semantic recall
  const similar = await vector.searchSimilar(user, message);

  // 5. LLM reasoning
  const reply = await llm.reason(
    { context, similar },
    message
  );

  return reply;
}

module.exports = { cognitiveStep };
