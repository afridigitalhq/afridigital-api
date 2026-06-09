const fs = require('fs');

/**
 * SAFE KERNEL API GATE
 */

const api = `
const kernel = require('./index');

module.exports = {
  config: kernel.config,
  runtime: kernel.runtime,
  registry: kernel.registry,
  resolve: kernel.resolve
};
`;

fs.writeFileSync('core/kernel/api.js', api);

console.log('✔ Kernel API rebuilt safely');
