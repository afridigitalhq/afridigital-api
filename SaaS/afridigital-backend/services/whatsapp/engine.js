const router = require("../../channels/message-router/router");
const brain = require("../../core/ai/brain");

module.exports = {
  async handle(user, message) {

    const decision = await router.route({
      user,
      message
    });

    const reply = await brain.think({
      user,
      message,
      flow: decision.flow
    });

    return {
      ok: true,
      flow: decision.flow,
      reply
    };
  }
};
