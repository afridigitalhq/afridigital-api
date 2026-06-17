const express = require('express');
const { loadRoutes } = require('../../core/bootstrap/routerLoader');

function createApp() {
  const app = express();
const attachObservability = require("../../core/observability/v1_4/http");
attachObservability(app);


  // core middleware
  app.use(express.json({ limit: '2mb' }));
// ================= OBSERVABILITY v4 =================

const bus = require("../../core/observability/v4/eventBus");

const { getTraceId } = require("../../core/observability/v4/traceStandard");

const { bindAdapters } = require("../../core/observability/v4/adapter");













bindAdapters();

// ================= GRAPH CONNECTOR v4 =================
const { bindGraphConnector } = require("../../core/observability/v4/graphConnector");
bindGraphConnector();















app.use((req, res, next) => {

  const traceId = getTraceId(req);



  bus.emitEvent("http_request", {

    traceId,

    path: req.path,

    method: req.method

  });



  res.setHeader("x-trace-id", traceId);

  next();

});


  app.use(express.urlencoded({ extended: true }));

  // trace id
  app.use((req, res, next) => {
    req.traceId = Math.random().toString(36).slice(2, 10);
    next();
  });

  // routes
  loadRoutes(app);

  // health
  app.get('/health', (req, res) => {
    res.json({ ok: true, service: 'afridigital-api' });
  });

  // 404
  app.use((req, res) => {
    res.status(404).json({ ok: false, error: 'not_found' });
  });

  // error handler
  app.use((err, req, res, next) => {
    console.error('🔥 ERROR:', err);
    res.status(500).json({ ok: false, error: err.message });
  });

  return app;
}

module.exports = createApp;
