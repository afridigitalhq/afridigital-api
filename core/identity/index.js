/**
 * 🧠 Unified AI Identity Layer
 * Web + WhatsApp + Admin = ONE USER BRAIN
 */

const users = new Map();

/**
 * 🔗 Resolve or create unified user
 */
function resolveIdentity(channel, identifier) {

  let user = users.get(identifier);

  if (!user) {

    user = {
      id: identifier,
      channels: {},
      behaviorProfile: {
        jobsCreated: 0,
        boostsUsed: 0,
        walletActivity: 0
      },
      aiMemory: {
        preferences: [],
        history: [],
        intentPatterns: []
      }
    };
  }

  user.channels[channel] = identifier;

  users.set(identifier, user);

  return user;
}

/**
 * 🧠 Merge cross-channel behavior
 */
function updateBehavior(userId, action) {

  const user = users.get(userId);

  if (!user) return null;

  user.behaviorProfile[action.type] =
    (user.behaviorProfile[action.type] || 0) + 1;

  user.aiMemory.history.push({
    action,
    timestamp: Date.now()
  });

  users.set(userId, user);

  return user;
}

/**
 * 📊 Get unified profile
 */
function getUserProfile(userId) {
  return users.get(userId);
}

module.exports = {
  resolveIdentity,
  updateBehavior,
  getUserProfile
};
