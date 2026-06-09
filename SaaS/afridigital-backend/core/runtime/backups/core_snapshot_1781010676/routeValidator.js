const fs = require('fs');
const path = require('path');

function isValidRouter(mod) {
  const candidate = mod?.router || mod;

  // Express router is a function OR object with .use
  const isRouter =
    typeof candidate === 'function' ||
    (typeof candidate === 'object' && typeof candidate.use === 'function');

  return isRouter;
}

function check(file) {
  let mod;

  try {
    mod = require(file);
  } catch (e) {
    throw new Error(`❌ FAILED TO IMPORT: ${file}\n${e.message}`);
  }

  if (!isValidRouter(mod)) {
    throw new Error(`❌ INVALID ROUTE EXPORT: ${file}`);
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

// MAIN ENTRY
const routesDir = path.join(__dirname, '../app/routes');

if (!fs.existsSync(routesDir)) {
  throw new Error(`❌ ROUTES DIR NOT FOUND: ${routesDir}`);
}

scan(routesDir);

console.log('✅ Route contract validation passed');
