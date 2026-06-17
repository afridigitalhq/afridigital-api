const obs = require('./index');

module.exports = function attachObservability(app) {

  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      service: 'afridigital-api',
      health: obs.snapshot().health
    });
  });

  app.get('/ready', (req, res) => {
    res.json({
      ok: true,
      status: obs.snapshot().ready ? 'ready' : 'initializing'
    });
  });

  app.get('/metrics', (req, res) => {
    res.json(obs.snapshot().metrics);
  });

  app.get('/trace', (req, res) => {
    res.json(obs.snapshot().traces.slice(-50));
  });
};
