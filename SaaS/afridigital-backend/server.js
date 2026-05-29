const express = require('express');
const path = require('path');
const { loadRoute } = require('./core/loader');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

app.use('/admin/control-plane', loadRoute(path.join(__dirname, 'routes/admin.routes')));
app.use('/webhook', loadRoute(path.join(__dirname, 'routes/webhook')));
app.use('/paystack', loadRoute(path.join(__dirname, 'routes/paystackRoutes')));
app.use('/api', loadRoute(path.join(__dirname, 'routes/runtime')));

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'afridigital-api' });
});

app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err);
  res.status(500).json({ ok: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
