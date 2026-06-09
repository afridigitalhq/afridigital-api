const fs = require('fs');

const kernel = `
// AUTO RECOVERY KERNEL (STABLE)

const config = require('./config');
const runtime = require('./runtime');
const registry = require('./pluginRegistry');
const resolve = require('./resolve');

const boot = require('./boot');
const observe = require('./observe');
const state = require('./state');

module.exports = {
  config,
  runtime,
  registry,
  resolve,
  boot,
  observe,
  state
};
`;

fs.writeFileSync('./core/kernel/index.js', kernel.trim());

console.log('🧠 KERNEL RECOVERY WRITTEN');
