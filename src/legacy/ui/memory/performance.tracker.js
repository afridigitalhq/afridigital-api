const memory = {};

/**
 * Track UI performance per user + mode
 */
function trackPerformance(userId, mode, metrics) {

  if (!memory[userId]) memory[userId] = {};

  if (!memory[userId][mode]) {
    memory[userId][mode] = {
      sessions: 0,
      engagement: 0,
      conversions: 0
    };
  }

  const m = memory[userId][mode];

  m.sessions += 1;
  m.engagement += metrics.engagement || 0;
  m.conversions += metrics.conversions || 0;
}

function getUserMemory(userId) {
  return memory[userId] || {};
}

module.exports = { trackPerformance, getUserMemory };
