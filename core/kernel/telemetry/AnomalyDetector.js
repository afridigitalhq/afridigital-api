// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class AnomalyDetector {
  detect(metrics) {
    const anomalies = [];

    if ((metrics.failures || 0) > 10) {
      anomalies.push("HIGH_FAILURE_RATE");
    }

    if ((metrics.throughput || 0) < 5) {
      anomalies.push("LOW_THROUGHPUT");
    }

    return {
      anomalies,
      severity:
        anomalies.length > 1 ? "HIGH" :
        anomalies.length === 1 ? "MEDIUM" : "LOW"
    };
  }
}

module.exports = { AnomalyDetector };
