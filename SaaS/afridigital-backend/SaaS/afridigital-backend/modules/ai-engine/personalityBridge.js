const { updateProfile, applyPersonality } = require("../identity/personalityEngine");

async function buildPersonaContext({ userId, message, response }) {
  updateProfile(userId, message, response || "");
}

function injectPersona({ userId, message }) {
  return applyPersonality(userId, message);
}

module.exports = { buildPersonaContext, injectPersona };
