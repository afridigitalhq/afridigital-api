const fs = require('fs');
const path = require('path');

function isExpressRouter(mod) {
  return (
    mod &&
    typeof mod === 'function' &&
    mod.stack &&
    Array.isArray(mod.stack)
  );
}

function loadModules(app) {
  const modulesPath = path.join(__dirname, 'modules');
  const folders = fs.readdirSync(modulesPath);

  for (const mod of folders) {
    const entry = path.join(modulesPath, mod, 'index.js');
    if (mod.startsWith('_')) continue;

    try {
      if (!fs.existsSync(entry)) continue;

      const route = require(entry);

      // ✅ STRICT: only Express routers allowed
      if (!isExpressRouter(route)) {
        console.log(`⚠️  Ignored non-router module: ${mod}`);
        continue;
      }

      app.use(`/modules/${mod}`, route);
      console.log(`✅ Mounted router: ${mod}`);

    } catch (err) {
      console.log(`❌ Module failed: ${mod} → ${err.message}`);
    }
  }
}

module.exports = loadModules;
