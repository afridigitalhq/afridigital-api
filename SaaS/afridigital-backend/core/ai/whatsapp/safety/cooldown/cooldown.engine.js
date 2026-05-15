/**
 * ❄ A3.18.9 COOLDOWN ENGINE
 * Soft restriction instead of hard ban
 */

const cooldownMap = new Map();

function applyCooldown(userId, durationMs = 60000) {

  cooldownMap.set(userId, {
    until: Date.now() + durationMs,
    status: "COOLDOWN"
  });

  return true;
}

function isOnCooldown(userId) {

  const data = cooldownMap.get(userId);

  if (!data) return false;

  if (Date.now() > data.until) {
    cooldownMap.delete(userId);
    return false;
  }

  return true;
}

function getCooldownStatus(userId) {
  return cooldownMap.get(userId) || { status: "NORMAL" };
}

module.exports = {
  applyCooldown,
  isOnCooldown,
  getCooldownStatus
};
