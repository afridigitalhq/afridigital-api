const { createSandbox } = require('./sandbox');
const path = require('path');
const EventEmitter = require('events');

const ROOT = process.cwd();

class KernelV3 extends EventEmitter {
  constructor() {
    super();
    this.registry = new Map();
    this.loaded = new Map();
  }

  resolve(moduleName) {
    const map = {
      config: path.join(ROOT, 'core/kernel/config'),
      runtime: path.join(ROOT, 'core/kernel/runtime'),
      registry: path.join(ROOT, 'core/kernel/pluginRegistry')
    };

    if (!map[moduleName]) {
      throw new Error('[KERNEL v3] Invalid module access: ' + moduleName);
    }

    return require(map[moduleName]);
  }

  registerPlugin(name, loader) {
    this.registry.set(name, loader);
  }

  loadPlugin(name) {
    const sandboxRun = createSandbox(this);
    const loader = this.registry.get(name);
    if (!loader) throw new Error('[KERNEL v3] Plugin not registered: ' + name);

    const instance = sandboxRun(loader, { name });
    this.loaded.set(name, instance);

    this.emit('plugin:loaded', name);
    return instance;
  }

  reloadPlugin(name) {
    this.emit('plugin:beforeReload', name);

    delete require.cache[require.resolve(name)];
    const plugin = this.loadPlugin(name);

    this.emit('plugin:reloaded', name);
    return plugin;
  }

  swap(oldName, newLoader) {
    this.registry.set(oldName, newLoader);
    this.reloadPlugin(oldName);
  }
}

module.exports = new KernelV3();
