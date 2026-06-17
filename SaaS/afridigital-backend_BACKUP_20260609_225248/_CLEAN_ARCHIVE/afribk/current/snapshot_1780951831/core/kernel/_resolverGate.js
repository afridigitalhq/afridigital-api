const path = require('path');

const ROOT = process.cwd();

/**
 * ONLY SAFE KERNEL ACCESS LAYER
 */

function resolveKernel(moduleName) {
  const allowed = {
    config: path.join(ROOT, 'core/kernel/config'),
    runtime: path.join(ROOT, 'core/kernel/runtime'),
    registry: path.join(ROOT, 'core/kernel/pluginRegistry'),
    resolve: path.join(ROOT, 'core/kernel/resolve')
  };

  if (!allowed[moduleName]) {
    throw new Error('[KERNEL GATE] Unauthorized kernel access: ' + moduleName);
  }

  return require(allowed[moduleName]);
}

module.exports = { resolveKernel };
