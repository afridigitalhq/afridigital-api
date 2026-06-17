const fs = require('fs');
const path = require('path');

function check(file) {
  const mod = require(file);

  const candidate = mod?.default || mod?.router || mod;

  const ok =
    typeof candidate === 'function' ||
    (candidate && candidate.stack && typeof candidate.stack === 'object');

  if (!ok) {
    throw new Error(`❌ INVALID ROUTE: ${file}`);
  }
}

function scan(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);

    if (fs.statSync(full).isDirectory()) {
      scan(full);
    } else if (f.endsWith('.js')) {
      check(full);
    }
  });
}

scan(path.join(__dirname, '../app/routes'));

console.log('✅ All routes valid');
