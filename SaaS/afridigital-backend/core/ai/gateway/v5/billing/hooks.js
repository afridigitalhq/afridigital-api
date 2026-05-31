const events = [];

function trackUsage(data) {
  events.push({
    ...data,
    ts: Date.now(),
    costUnits: Math.max(1, (data.tokens || 10) / 100)
  });
}

function getBillingEvents() {
  return events;
}

module.exports = { trackUsage, getBillingEvents };
