const fs = require('fs');

const file = './core/kernel/index.js';

const kernel = `
// AUTO-GENERATED ASH KERNEL REBUILD (SAFE MODE)

const config = require('./config');
const runtime = require('./runtime');
const registry = require('./pluginRegistry');
const resolve = require('./resolve');

const boot = require('./boot');
const observe = require('./observe');
const routes = require('./routes');
const state = require('./state');

module.exports = {
  // legacy compatibility (Render-safe)
  config,
  runtime,
  registry,
  resolve,

  // v4 system core
  boot,
  observe,
  routes,
  state
};
`;

fs.writeFileSync(file, kernel.trim());

console.log('✔ ASH KERNEL REBUILD COMPLETE');
