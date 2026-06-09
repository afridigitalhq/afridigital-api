const routes = require('./routes');

function middleware(req, res, next) {
  req.traceId = req.headers['x-request-id'] || Date.now().toString();
  next();
}

module.exports = { routes, middleware };
