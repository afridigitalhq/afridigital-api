const app = require('./src/index.js');

console.log("🧠 SINGLE EXPRESS ENTRY ACTIVE");

const PORT = process.env.PORT || 10000;

// force full boot visibility
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 FULL API UNIFIED LIVE ON", PORT);
});

// prevent hidden kernel takeover
process.on('uncaughtException', (err) => {
  console.error("❌ CRASH:", err);
});

process.on('unhandledRejection', (err) => {
  console.error("❌ PROMISE ERROR:", err);
});

module.exports = server;
