const fs = require('fs');
const path = require('path');
const { extractRouter } = require('./validate');

function scanRoutes(app, baseDir = path.join(process.cwd(), 'routes')) {
  if (!fs.existsSync(baseDir)) {
    throw new Error(`Routes directory missing: ${baseDir}`);
  }

  const files = fs.readdirSync(baseDir);

  files.forEach((file) => {
    if (!file.endsWith('.js')) return;

    const fullPath = path.join(baseDir, file);
    const mod = require(fullPath);

    const router = extractRouter(mod);

    if (!router) {
      throw new Error(`Invalid route export: ${file}`);
    }

    const routeName =
      '/' +
      file
        .replace('.routes.js', '')
        .replace('.js', '');

    app.use(routeName, router);

    console.log(`Mounted → ${routeName}`);
  });
}

module.exports = { scanRoutes };
