const fs = require('fs');
const path = require('path');

function safeRequire(p) {
  try { return require(p); } catch (e) { return null; }
}

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

(async () => {

  console.log("🧠 AFRI CONTROL MODE v2 START");

  // -----------------------------
  // 1. WHATSAPP WEBHOOK CHECK
  // -----------------------------
  const whatsappRoute =
    exists('./core/ai/gateway/v5/plugins/whatsapp') ||
    exists('./routes/webhook.js');

  const whatsappPlugin = safeRequire('./core/ai/gateway/v5/plugins/whatsapp');

  const whatsapp = {
    route: whatsappRoute,
    plugin: !!whatsappPlugin
  };

  // -----------------------------
  // 2. FRONTEND INTEGRATION
  // -----------------------------
  const frontendPath = '../frontend';
  const frontend = {
    exists: exists(frontendPath),
    package: exists(path.join(frontendPath, 'package.json')),
    envHint: exists(path.join(frontendPath, '.env')) ||
             exists(path.join(frontendPath, '.env.example'))
  };

  // -----------------------------
  // 3. ROUTE GRAPH AUDIT
  // -----------------------------
  const routeFiles = [
    './server.js',
    './app.js'
  ].filter(exists);

  const routes = {
    server: routeFiles.length > 0,
    webhook: exists('./routes/webhook.js'),
    api: exists('./routes'),
    health: true
  };

  // -----------------------------
  // 4. PLUGIN REGISTRY CHECK
  // -----------------------------
  const registry =
    safeRequire('./core/kernel/pluginRegistry') ||
    safeRequire('./core/kernel/registry') ||
    {};

  const pluginCheck = {
    registryLoaded: !!registry,
    whatsappPlugin: !!whatsappPlugin
  };

  // -----------------------------
  // FINAL RESULT
  // -----------------------------
  const result = {
    whatsapp,
    frontend,
    routes,
    plugins: pluginCheck,
    status:
      whatsapp.plugin &&
      frontend.exists &&
      routes.server &&
      pluginCheck.whatsappPlugin
        ? "CONTROL_V2_PASS"
        : "CONTROL_V2_DEGRADED"
  };

  console.log("🧪 CONTROL V2 SNAPSHOT:");
  console.log(JSON.stringify(result, null, 2));

})();
