const aiGuard = require("./aiGuard");
const aiRouter = require("../ai-engine/router");
const logAI = require("./aiLogger");

async function aiPipeline(payload) {
  const validated = aiGuard(payload);

  if (!validated.ok) {
    return "⚡ Invalid request.";
  }

  const { message, channel, from } = validated.data;

  const response = await aiRouter({
    message,
    channel,
    from
  });

  logAI({
    channel,
    from,
    input: message,
    output: response,
    mode: "router"
  });

  return response;
}

module.exports = aiPipeline;
