module.exports = (app) => {

  // TEST ROUTE (safe)
  app.post('/api/test', (req, res) => {
    res.json({
      ok: true,
      message: "API TEST OK",
      body: req.body || null
    });
  });

  // WEBHOOK ENTRY (WhatsApp safe placeholder)
  app.get('/webhook', (req, res) => {
    res.status(200).json({
      ok: true,
      webhook: "active",
      mode: "verification_placeholder"
    });
  });

  // WhatsApp POST entry (future integration safe)
  app.post('/webhook', (req, res) => {
    res.status(200).json({
      ok: true,
      received: true
    });
  });

};
