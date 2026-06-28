// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { TelemetryEngine } = require("./TelemetryEngine");
const { AnomalyDetector } = require("./AnomalyDetector");
const { ForecastEngine } = require("./ForecastEngine");

module.exports = {
  telemetry: TelemetryEngine,
  anomaly: new AnomalyDetector(),
  forecast: new ForecastEngine()
};
