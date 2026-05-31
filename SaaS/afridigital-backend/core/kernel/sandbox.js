/**
 * KERNEL v3.1 SANDBOX ENGINE
 * Prevents plugin kernel escape
 */

const vm = require('vm');

function createSandbox(kernel) {
  return function runPlugin(pluginFn, context = {}) {

    const safeAPI = {
      kernel,
      config: kernel.resolve('config'),
      runtime: kernel.resolve('runtime'),
      registry: kernel.resolve('registry')
    };

    const sandbox = {
      module: {},
      exports: {},
      require: () => {
        throw new Error('[SANDBOX] require() blocked in plugin');
      },
      console,
      ...safeAPI,
      ...context
    };

    vm.createContext(sandbox);

    const wrapped = `
      (function(module, exports, kernel, config, runtime, registry) {
        return (${pluginFn.toString()})(sandbox);
      })
    `;

    return vm.runInContext(wrapped, sandbox);
  };
}

module.exports = { createSandbox };
