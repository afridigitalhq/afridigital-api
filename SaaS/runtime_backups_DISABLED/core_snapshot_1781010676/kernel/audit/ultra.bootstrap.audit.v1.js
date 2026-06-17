const fs = require('fs');
const path = require('path');

function safeRequire(p) {
  try { return require(p); } catch (e) { return null; }
}

const result = {
  kernel: false,
  backend: false,
  frontend: true,
  render: false,
  whatsapp: false
};

// 1. KERNEL
try {
  const k = require('../index');
  result.kernel =
    typeof k.config?.get === 'function' &&
    typeof k.registry === 'object' &&
    typeof k.runtime === 'object';
} catch {}

// 2. BACKEND
try {
  safeRequire('../../ai/gateway/v5/plugins/whatsapp');
  safeRequire('../../ai/gateway/v5/runtime/transport');
  result.backend = true;
} catch {}

// 3. FRONTEND (optional)
const frontendPath = path.join(process.cwd(), '../frontend');
if (fs.existsSync(frontendPath)) {
  result.frontend = fs.existsSync(path.join(frontendPath, 'package.json'));
}

// 4. ENV / RENDER
const envCheck =
  process.env.AUTH_TOKEN &&
  process.env.WHATSAPP_TOKEN &&
  process.env.JWT_SECRET;

result.render = !!envCheck;

// 5. WHATSAPP
try {
  const w = safeRequire('../../ai/gateway/v5/plugins/whatsapp');
  result.whatsapp = !!w;
} catch {}

const pass = Object.values(result).every(Boolean);

console.log("🧪 AFRAI BOOT AUDIT v1");
console.log("STATUS:", pass ? "PASS" : "FAIL");

const failed = Object.entries(result)
  .filter(([k,v]) => !v)
  .map(([k]) => k);

console.log("FAILED:", failed.length ? failed.join(", ") : "NONE");

process.exit(pass ? 0 : 1);
