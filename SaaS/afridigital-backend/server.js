const { createFlowSocket } = require("./core/flow/ws/flowSocket");
const createApp = require('./core/runtime/bootstrap');
const app = createApp();
app.use("/flow", require("./routes/flow.routes"));
const flow = require('./core/flow/router');
app.use('/flow', flow);

const bus = require('./core/redis/streamBus');

// optional observability (safe guard)
try {
  const { registerDashboardStream } = require('./core/observability/v4/stream/sseTraceStream');
  registerDashboardStream(app, bus);
} catch (e) {
  console.log("⚠️ dashboard stream skipped");
}

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
createFlowSocket(server);
const { createFlowSocket } = require("./core/flow/ws/flowSocket");
  console.log("🚀 AFRI KERNEL v2 RUNNING ON", PORT);
});

process.on('SIGINT', () => server.close());
process.on('SIGTERM', () => server.close());

module.exports = app;
