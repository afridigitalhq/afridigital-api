const { assertApiVersion } = require("../runtime/safety/api.guard");
const context = require("../context/engine");
const sponsor = require("../sponsor/engine");
const actions = require("./actions");

module.exports = {
  route(user, message) {

    const intent = context.classify(message);

    context.set(user, {
      lastIntent: intent,
      lastMessage: message
    });

    return {
      intent,
      actions: actions.get(intent),
      sponsored: sponsor.inject(intent)
    };
  }
};
