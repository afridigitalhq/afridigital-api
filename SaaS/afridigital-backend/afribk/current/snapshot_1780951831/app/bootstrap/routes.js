const fs = require('fs');
const path = require('path');
const { loadRoute } = require('../../core/loader');

module.exports = function registerRoutes(app) {
  const routesDir = path.join(__dirname, '../routes');

  if (!fs.existsSync(routesDir)) {
    throw new Error('Routes directory missing');
  }

  fs.readdirSync(routesDir)
    .filter(f => f.endsWith('.js'))
    .forEach(file => {
      const fullPath = path.join(routesDir, file);

      // derive route name
      const base = file.replace('.routes.js', '').replace('.js', '');
      const routePath = '/' + base;

      const router = loadRoute(fullPath);

      app.use(routePath, router);
    });

  // health route fallback
  app.use('/health', require('./health'));
};
