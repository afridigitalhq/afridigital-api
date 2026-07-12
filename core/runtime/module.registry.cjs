const path = require('path');

function assertModule(file) {
  if (!file.includes('dist/')) {
    throw new Error('MODULE VIOLATION: only dist modules allowed');
  }
}

const registeredModules = new Map();

function register(module) {
  if (!module || !module.id) {
    throw new Error('INVALID MODULE');
  }

  registeredModules.set(module.id, module);
  return module;
}

function get(id) {
  return registeredModules.get(id);
}

function list() {
  return Array.from(registeredModules.keys());
}

module.exports = {
  assertModule,
  register,
  get,
  list
};
