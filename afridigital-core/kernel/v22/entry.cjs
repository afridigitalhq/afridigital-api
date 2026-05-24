const { processAI } = require("./core.ai.cjs");

function handleMessage(msg) {

  return processAI(msg.user, {
    type: msg.type,
    clicked: msg.clicked
  });
}

module.exports = { handleMessage };
