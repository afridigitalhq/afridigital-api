const fs = require('fs');
const path = require('path');
const { validateJS } = require('./shield/v4/ast.validator');
const { saveSnapshot, latestSnapshot } = require('./shield/v4/vault');

const FILE = path.join(__dirname, 'afri.queue.engine.cjs');
const VAULT = path.join(__dirname, '.vault');

function restore() {
  const snap = latestSnapshot();
  if (snap?.content) {
    fs.writeFileSync(FILE, snap.content);
    console.log('🛡 RESTORED SNAPSHOT');
  }
}

function guard() {
  try {
    const ok = validateJS(FILE);

    if (!ok) {
      console.log('🚨 CORRUPTION DETECTED');
      restore();
      process.exit(1);
    }

    const content = fs.readFileSync(FILE, 'utf8');
    saveSnapshot(FILE, content);

    console.log('✅ SHIELD OK');
  } catch (e) {
    console.log('SHIELD ERROR:', e.message);
  }
}

module.exports = { guard };
