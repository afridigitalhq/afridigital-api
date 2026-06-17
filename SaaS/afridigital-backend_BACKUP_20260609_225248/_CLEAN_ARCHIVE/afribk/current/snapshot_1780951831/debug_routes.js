const fs = require('fs');

const targets = [
  'server.js',
  'core/routeLoader.js',
  'core/loader/mountRoutes.js',
  'core/africore/router/index.js',
  'core/routeValidator.js'
];

for (const f of targets) {
  try {
    const c = fs.readFileSync(f,'utf8');

    const hits = [];

    if (c.includes('redirect')) hits.push('redirect');
    if (c.includes('normalize')) hits.push('normalize');
    if (c.includes('strict')) hits.push('strict routing');
    if (c.includes('app.use')) hits.push('app.use');

    if (hits.length) {
      console.log('\n🚨 FILE:', f);
      console.log('FLAGS:', hits);
    }
  } catch(e) {}
}
