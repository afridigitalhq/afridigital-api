process.on('uncaughtException', (err) => {
  console.error('💥 CRASH GUARD:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('⚠️ PROMISE FAILURE:', err);
});

setInterval(() => {
  // lightweight heartbeat log (safe for Render logs)
  console.log('🫀 v4 heartbeat', new Date().toISOString());
}, 15000);
