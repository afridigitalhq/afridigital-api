process.on('uncaughtException', e => console.error('CRASH SAFE:', e));
process.on('unhandledRejection', e => console.error('PROMISE SAFE:', e));

require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// BOOT CORE SYSTEM
try { require('./core/bootstrap/v8.kernel').boot(app); } catch(e) { console.log('BOOT SKIPPED', e.message); }
app.use('/control', require('./routes/control.routes'));
if (process.env.ENABLE_WORKERS === 'true') {
  require('./workers/cluster.worker');
}
if (process.env.ENABLE_WORKERS === 'true') {
  require('./workers/retry/worker');
}

// ROUTES
app.use('/dashboard', require('./routes/dashboard.routes'));app.use('/webhook', require('./routes/webhook.routes'));
app.use('/health', require('./routes/health.routes'));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("🚀 V8.20 CLEAN KERNEL RUNNING", PORT);
});
