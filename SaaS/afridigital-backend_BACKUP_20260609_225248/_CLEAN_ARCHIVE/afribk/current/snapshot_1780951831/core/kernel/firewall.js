const Module = require('module');
const originalRequire = Module.prototype.require;

/**
 * KERNEL IMPORT FIREWALL
 * Blocks unsafe kernel bypass attempts
 */

Module.prototype.require = function (path) {
  const isKernelBypass =
    path.includes('core/kernel/config') ||
    path.includes('core/kernel/runtime') ||
    path.includes('core/kernel/pluginRegistry');

  if (isKernelBypass && !path.includes('core/kernel/api')) {
    throw new Error('[KERNEL FIREWALL] Direct kernel access blocked: ' + path);
  }

  return originalRequire.apply(this, arguments);
};

console.log('✔ Kernel firewall active');
