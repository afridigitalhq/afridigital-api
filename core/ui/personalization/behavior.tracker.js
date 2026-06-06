const userBehavior = {};

/**
 * Track user interactions
 */
function track(userId, widget) {

  if (!userBehavior[userId]) {
    userBehavior[userId] = {};
  }

  userBehavior[userId][widget] =
    (userBehavior[userId][widget] || 0) + 1;
}

function getBehavior(userId) {
  return userBehavior[userId] || {};
}

module.exports = { track, getBehavior };
