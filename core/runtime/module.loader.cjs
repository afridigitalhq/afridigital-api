const registry = require('./module.registry.cjs');

function loadModule(moduleDef) {
  if (!moduleDef.__validate || !moduleDef.__validate()) {
    throw new Error('MODULE REJECTED');
  }

  registry.register(moduleDef);
  return registry.list();
}

module.exports = { loadModule };
