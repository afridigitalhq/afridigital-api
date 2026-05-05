const fs = require('fs');
const path = require('path');

function loadModules(app) {
  const modulesPath = path.join(__dirname, 'modules');

  const folders = fs.readdirSync(modulesPath);

  for (const mod of folders) {
    const modPath = path.join(modulesPath, mod);
    const stat = fs.statSync(modPath);

    if (stat.isDirectory()) {
      const entry = path.join(modPath, 'index.js');

      if (fs.existsSync(entry)) {
        const route = require(entry);
        app.use(`/modules/${mod}`, route);
        console.log(`✅ Loaded module: ${mod}`);
      }
    }
  }
}

module.exports = loadModules;
