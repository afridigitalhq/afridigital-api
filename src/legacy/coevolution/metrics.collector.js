const metrics = [];

/**
 * Collect both UI + marketplace signals
 */
function collectMetric(event) {

  metrics.push({
    ...event,
    timestamp: Date.now()
  });
}

function getMetrics() {
  return metrics;
}

module.exports = { collectMetric, getMetrics };
