require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// HEALTH CHECK
app.get('/health', (req,res) => {
  res.json({ ok: true, service: 'afrios' });
});

// ROUTES (clean baseline only)
app.use('/admin/control-plane', require('./routes/admin.routes'));
app.use('/webhook', require('./routes/webhook'));
app.use('/api', require('./routes/runtime'));
app.use('/api/ai', require('./routes/ai'));
app.use('/whatsapp', require('./core/africore/whatsapp/webhook'));

// START SERVER
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 AfriOS running on port', PORT);
});
