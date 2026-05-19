const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * ⏳ AfriOS Cooldown Engine
 */

function withdrawalCooldown(hours = 24) {

  const now = Date.now();

  return {
    createdAt: new Date(now).toISOString(),
    unlockAt: new Date(
      now + hours * 60 * 60 * 1000
    ).toISOString()
  };
}

module.exports = {
  withdrawalCooldown
};
