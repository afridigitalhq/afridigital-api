module.exports = (app) => {

  // HEALTH TEST ROUTE
  app.get('/api/test', (req, res) => {
    res.json({
      ok: true,
      route: "api/test",
      status: "ACTIVE"
    });
  });

  // WEBHOOK (WhatsApp entry)
  app.get('/webhook', (req, res) => {
    res.json({
      ok: true,
      webhook: "ready"
    });
  });

  app.post('/webhook', (req, res) => {
    res.json({
      ok: true,
      received: true
    });
  });

};
