const bus = require('../eventbus');

function trackUserEvent(userId, event) {

  const record = {
    userId,
    event,
    timestamp: Date.now()
  };

  bus.emit("USER_FEEDBACK_EVENT", record);

  return record;
}

module.exports = { trackUserEvent };
