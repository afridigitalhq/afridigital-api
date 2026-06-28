function shouldRollback(metrics) {
  if (!metrics) return false;

  return (
    metrics.errorRate > 0.2 ||
    metrics.latency > 1200 ||
    metrics.wsFailures > 5
  );
}

module.exports = { shouldRollback };
