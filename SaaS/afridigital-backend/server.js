const createApp = require('./core/runtime/bootstrap');

const app = createApp();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 AFRIDIGITAL CLEAN CORE RUNNING ON", PORT);
});

process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());

module.exports = app;
