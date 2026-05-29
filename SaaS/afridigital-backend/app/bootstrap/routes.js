const fs = require('fs');
const path = require('path');

function resolveRoutePath(file) {
  const base = file.replace(/\.js$/, '').replace(/\.routes$/, '');
  return base === 'index' ? '/' : '/' + base;
}

function extractRouter(mod) {
  if (!mod) return null;
  if (mod.default) return mod.default;
  if (mod.router) return mod.router;
  return mod;
}

/**
 * STRICT Express Router validation
 * MUST have .use AND .stack to be valid
 */
function isExpressRouter(candidate) {
  if (!candidate) return false;
  return typeof candidate.use === 'function' && Array.isArray(candidate.stack);
}

function safeRegister(app, routePath, filePath) {
  try {
    const mod = require(filePath);
    const router = extractRouter(mod);

    if (!isExpressRouter(router)) {
      throw new Error(`Invalid router export: ${filePath}`);
    }

    app.use(routePath, router);
    console.log(`✔ mounted ${routePath}`);
  } catch (err) {
    console.error(`🔥 Route load failed: ${filePath}`, err.message);
    throw err; // FAIL FAST (production safe)
  }
}

module.exports = function registerRoutes(app) {
  const routesDir = path.join(__dirname, '../routes');

  if (!fs.existsSync(routesDir)) {
    throw new Error('Routes directory missing');
  }

  const files = fs.readdirSync(routesDir)
    .filter(f => f.endsWith('.js'));

  for (const file of files) {
    const routePath = resolveRoutePath(file);
    const filePath = path.join(routesDir, file);
    safeRegister(app, routePath, filePath);
  }

  console.log('🟢 Route layer loaded (STRICT MODE)');
};
