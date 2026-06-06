const globalEvents = [];

/**
 * Collect UI behavior across ALL users
 */
function collectEvent(event) {

  globalEvents.push({
    ...event,
    timestamp: Date.now()
  });
}

function getAllEvents() {
  return globalEvents;
}

module.exports = { collectEvent, getAllEvents };
