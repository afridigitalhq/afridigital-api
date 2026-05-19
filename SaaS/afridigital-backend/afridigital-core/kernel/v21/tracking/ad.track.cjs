const logs = [];

function trackAdEvent(event) {
  logs.push({
    ...event,
    time: Date.now()
  });

  return { tracked: true };
}

module.exports = { trackAdEvent };
