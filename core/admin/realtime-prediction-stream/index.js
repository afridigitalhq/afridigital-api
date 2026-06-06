const bus = require("../../eventbus");

/**
 * 🔥 Real-Time Prediction Streaming Layer (ADMIN ONLY)
 * Streams AI forecasts from live marketplace events
 */

const state = {
  stream: [],
  latest: null
};

/**
 * Aggregate events into prediction signals
 */
function computeSignal(events) {

  const summary = {};

  events.forEach(e => {

    if (!summary[e.type]) {
      summary[e.type] = 0;
    }

    summary[e.type] += e.value || 1;
  });

  return summary;
}

/**
 * Convert signals into forecast
 */
function generateForecast(signal) {

  const jobs = signal.JOB || 0;
  const earnings = signal.EARN || 0;

  const growth = (jobs * 0.8) + (earnings * 0.5);

  return {
    timestamp: Date.now(),
    jobForecast: jobs * 1.2,
    earningsForecast: earnings * 1.3,
    marketTrend: growth > 50 ? "EXPANDING" : "STABLE",
    confidence: Math.min(0.98, growth / 100)
  };
}

/**
 * Subscribe to ALL economy events
 */
bus.on("EARN", (data) => {

  const forecast = generateForecast([{ type: "EARN", value: data.amount }]);

  state.latest = forecast;
  state.stream.push(forecast);
});

bus.on("SPEND", (data) => {

  const forecast = generateForecast([{ type: "SPEND", value: data.amount }]);

  state.latest = forecast;
  state.stream.push(forecast);
});

/**
 * ADMIN ACCESS ONLY
 */
function getStream() {
  return state.stream.slice(-50);
}

function getLatestForecast() {
  return state.latest;
}

module.exports = {
  getStream,
  getLatestForecast
};
