async function updateLearning(redis, message, decision) {
  const userKey = `user:profile:${message.user}`;

  const profile = JSON.parse(await redis.get(userKey) || "{}");

  profile.messages = (profile.messages || 0) + 1;

  if (decision.action === "PRIORITY") {
    profile.trust = (profile.trust || 0) + 1;
  }

  if (decision.action === "DROP") {
    profile.risk = (profile.risk || 0) + 1;
  }

  profile.lastIntent = decision.agent;

  await redis.set(userKey, JSON.stringify(profile), { EX: 60 * 60 * 24 * 30 });

  return profile;
}

module.exports = { updateLearning };
