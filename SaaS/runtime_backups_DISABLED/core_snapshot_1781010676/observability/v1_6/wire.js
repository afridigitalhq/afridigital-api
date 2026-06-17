const trace = require('../v1_5/trace');
const obs = require('../v1_4');

module.exports = function wireObservability(app) {

  // GLOBAL TRACE INJECTION (EARLY MIDDLEWARE)
  app.use(trace(obs));

  // lightweight request tracking
  app.use((req, res, next) => {
    obs.track('request_seen', {
      traceId: req.traceId,
      path: req.path,
      method: req.method
    });
    next();
  });

};
