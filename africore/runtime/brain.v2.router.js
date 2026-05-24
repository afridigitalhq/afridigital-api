const brain = require("./brain.v2.memory");
const semantic = require("./brain.v2.semantic");

async function buildContext(user, message) {

  const memory = await brain.recall(user);
  const tags = await semantic.updateSemantic(user, message);

  return {
    summary: memory.summary,
    lastMessages: memory.messages.slice(0, 5),
    tags
  };
}

module.exports = { buildContext };
