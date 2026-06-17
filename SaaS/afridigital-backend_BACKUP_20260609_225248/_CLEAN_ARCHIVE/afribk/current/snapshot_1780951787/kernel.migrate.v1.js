const fs = require('fs');

function write(file, content) {
  fs.writeFileSync(file, content);
}

/* 1. CONFIG */
write('core/kernel/config/index.js', `
const loader = require('./loader');

module.exports = {
  get: () => loader,
  raw: loader
};
`);

/* 2. RESOLVE */
write('core/kernel/config/resolve.js', `
module.exports = require('./loader');
`);

/* 3. KERNEL ENTRY */
write('core/kernel/index.js', `
module.exports = {
  config: require('./config'),
  runtime: require('./runtime'),
  registry: require('./pluginRegistry'),
  resolve: require('./resolve')
};
`);

console.log('✔ MIGRATION FILE READY');
