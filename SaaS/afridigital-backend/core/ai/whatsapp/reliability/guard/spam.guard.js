/**
 * 🐕 ABUSE + SPAM GUARD
 * Prevents WhatsApp overload / user spam loops
 */

const userCounters = new Map();

function allowSend(userId) {

  const now = Date.now();
  const data = userCounters.get(userId) || {
    count: 0,
    lastReset: now
  };

  // reset every minute window
  if (now - data.lastReset > 60000) {
    data.count = 0;
    data.lastReset = now;
  }

  data.count += 1;
  userCounters.set(userId, data);

  // limit = 20 messages/min
  return data.count <= 20;
}

module.exports = { allowSend };
