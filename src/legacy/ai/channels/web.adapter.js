const { AfriAI } = require("../unified.brain");

async function handleWebMessage(msg, userId) {
  return AfriAI(msg, {
    channel: "web",
    userId
  });
}

module.exports = { handleWebMessage };
