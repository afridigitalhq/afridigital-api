const bus = require("../events/bus");

/**
 * 🟣 WHATSAPP TYPING SYNC EMITTER
 */

async function typingOn(user) {
  await bus.publish("typing:on", { user });
}

async function typingOff(user) {
  await bus.publish("typing:off", { user });
}

module.exports = { typingOn, typingOff };
