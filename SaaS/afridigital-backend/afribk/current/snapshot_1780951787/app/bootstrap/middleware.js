const express = require('express');
require('../middleware/processGuards');

module.exports = function registerMiddleware(app) {
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    req.traceId = Math.random().toString(36).slice(2, 10);
    next();
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      ok: false,
      error: 'route_not_found',
      traceId: req.traceId
    });
  });

  // error handler (must be last)
  app.use((err, req, res, next) => {
    console.error('🔥 ERROR:', err);
    res.status(500).json({
      ok: false,
      error: 'internal_error'
    });
  });
};
