class LoadPredictor {
  estimate(events) {
    const rate = events.length / Math.max(1, (Date.now() / 1000));
    return {
      rate,
      risk: rate > 50 ? "HIGH" : rate > 20 ? "MEDIUM" : "LOW"
    };
  }
}

module.exports = { LoadPredictor };
