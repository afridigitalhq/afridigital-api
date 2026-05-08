module.exports = {
  optimize: (metrics) => {
    console.log("🧠 Optimizing system load...");
    return {
      action: "rebalance_nodes",
      reason: "high_latency_detected"
    };
  }
};
