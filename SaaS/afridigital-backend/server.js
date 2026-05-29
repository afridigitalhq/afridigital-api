const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

function safeUse(path, mod) {
  const router = mod?.router || mod;

  if (!router || (typeof router !== 'function' && typeof router !== 'object')) {
    throw new Error(`Invalid middleware at ${path}`);
  }

  app.use(path, router);
}

// ROUTES (SAFE MOUNT)
safeUse('/admin/control-plane', require('./routes/admin.routes'));
safeUse('/webhook', require('./routes/webhook'));
safeUse('/api', require('./routes/runtime'));

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 server running on ${PORT}`);
});
