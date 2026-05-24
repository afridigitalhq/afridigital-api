const analytics = [];

function trackEvent(event) {
  analytics.push({
    ...event,
    time: Date.now()
  });

  return { status: "tracked" };
}

module.exports = { trackEvent };
