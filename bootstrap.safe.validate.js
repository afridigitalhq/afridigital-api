const fs = require('fs');
const vm = require('vm');

const path = './server.js';
const raw = fs.readFileSync(path, 'utf8');

console.log('🧠 AFRIDIGITAL SAFE BOOTSTRAP START');

// 1. SYNTAX CHECK (NO EXECUTION)
try {
  vm.createScript(raw);
  console.log('🟢 SYNTAX VALID');
} catch (e) {
  console.log('🔴 SYNTAX ERROR');
  console.log(e.message);
  process.exit(1);
}

// 2. STRUCTURE VALIDATION
const checks = {
  hasExpress: raw.includes('express'),
  hasRoutes: raw.includes('app.get') || raw.includes('app.post'),
  hasKernel: raw.includes('createKernel'),
  hasHealth: raw.includes('/health')
};

console.log('📊 STRUCTURE CHECK:', checks);

const ok = Object.values(checks).every(v => v === true);

if (!ok) {
  console.log('🟡 STRUCTURE INCOMPLETE');
  process.exit(1);
}

// 3. SAFE SNAPSHOT (NO MUTATION)
const snap = `snapshots/server.backup.${Date.now()}.js`;
fs.mkdirSync('snapshots', { recursive: true });
fs.writeFileSync(snap, raw);

console.log('🟢 SNAPSHOT CREATED:', snap);

// 4. REPORT
console.log('🟢 BOOTSTRAP COMPLETE - SYSTEM STABLE');
