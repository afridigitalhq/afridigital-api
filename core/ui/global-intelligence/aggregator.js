const { getAllEvents } = require("./event.collector");

/**
 * Aggregates UI performance across users
 */
function aggregateUIStats() {

  const events = getAllEvents();

  const stats = {};

  events.forEach(e => {

    if (!stats[e.mode]) {
      stats[e.mode] = {
        users: new Set(),
        engagement: 0,
        conversions: 0,
        sessions: 0
      };
    }

    const s = stats[e.mode];

    s.users.add(e.userId);
    s.engagement += e.engagement || 0;
    s.conversions += e.conversions || 0;
    s.sessions += 1;
  });

  return stats;
}

module.exports = { aggregateUIStats };
