/**
 * AFRIDIGITAL MODULE LATTICE
 * Zero-drift orchestration layer
 */

const registry = require('../runtime/module.registry.cjs');

const MODULES = {
  AI: 'afri.ai',
  SOC: 'afri.soc',
  COMM: 'afri.comm',
  WHATSAPP: 'afri.whatsapp',
  BANK: 'afri.bank',
  VISION: 'afri.vision',
  TRACKING: 'afri.tracking',
  BOOST: 'afri.boost',
  COMMERCE: 'afri.commerce',
  METAWORLD: 'afri.metaworld',
  SPORTS: 'afri.sports'
};

function registerAll(mods = []) {
  mods.forEach(m => registry.register(m));
  return registry.list();
}

function status() {
  return {
    modules: Object.keys(MODULES).length,
    registry: registry.list().length
  };
}

module.exports = {
  MODULES,
  registerAll,
  status
};
