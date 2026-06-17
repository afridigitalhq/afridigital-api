const app = require('./app/bootstrap/app');

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err);
});

console.log("🧠 AFRIDIGITAL BOOT SAFE MODE STARTING");

app.start?.() || app();
