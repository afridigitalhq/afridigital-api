const express = require('express');
const registerMiddleware = require('./bootstrap/middleware');
const registerRoutes = require('./bootstrap/routes');

module.exports = function createApp() {
  const app = express();

  registerMiddleware(app);
  registerRoutes(app);

  return app;
};
