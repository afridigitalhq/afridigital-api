const fs = require('fs');
const path = require('path');
const { resolveExport, assertMountable } = require('../utils/routeResolver');

function safeMount(app, routePath, filePath, mod) {
  const resolved = resolveExport(filePath, mod);
  assertMountable(resolved, filePath);

  if (resolved.type === 'router') {
    app.use(routePath, resolved.value);
    return;
  }

  if (resolved.type === 'middleware') {
    app.use(routePath, resolved.value);
    return;
  }
}

function loadRoutes(app, dir = path.join(process.cwd(), 'app/routes')) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir)
    .filter(f => f.endsWith('.js'))
    .forEach(file => {
      const fullPath = path.join(dir, file);
      const mod = require(fullPath);

      const routeName = '/' + file.replace('.js', '');

      safeMount(app, routeName, fullPath, mod);
    });
}

module.exports = { loadRoutes };
