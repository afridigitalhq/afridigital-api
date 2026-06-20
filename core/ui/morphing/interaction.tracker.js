const state = {};

/**
 * Track real-time user actions
 */
function trackInteraction(userId, widget) {

  if (!state[userId]) state[userId] = {};

  state[userId][widget] =
    (state[userId][widget] || 0) + 1;
}

function getState(userId) {
  return state[userId] || {};
}

module.exports = { trackInteraction, getState };
