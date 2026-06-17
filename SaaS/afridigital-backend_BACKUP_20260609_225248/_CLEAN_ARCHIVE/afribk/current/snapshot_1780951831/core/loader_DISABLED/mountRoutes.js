const fs = require('fs');
const path = require('path');
const { assertValidRoute } = require('./routeValidator');

function mountRoutes(app, routesDir) {
  const files = fs.readdirSync(routesDir);

  files.forEach(file => {
    if (!file.endsWith('.js')) return;

    const fullPath = path.join(routesDir, file);
    const mod = require(fullPath);

    const router = assertValidRoute(mod, fullPath);

    const routeName = '/' + file
      .replace('.routes.js', '')
      .replace('.js', '');

    app.use('/api'+routeName, router);

    console.log(`Mounted → ${routeName}`);
  });
}

module.exports = mountRoutes;
