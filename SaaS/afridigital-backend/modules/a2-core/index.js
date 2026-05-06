const logMessage = require("../../services/logging/logger");

async function a2Core({ context, aiResponse }) {
  await logMessage({
    userPhone: context.user.phone,
    message: context.message,
    response: aiResponse,
    channel: context.channel
  });

  return aiResponse;
}

module.exports = a2Core;
