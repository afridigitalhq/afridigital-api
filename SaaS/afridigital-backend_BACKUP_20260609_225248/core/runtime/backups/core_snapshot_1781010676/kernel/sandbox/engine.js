const path = require('path');

class Sandbox {
  constructor() {
    this.allowedRoots = [
      path.join(process.cwd(), 'core/ai/gateway/v5/plugins')
    ];
  }

  validate(pluginPath) {
    const full = path.resolve(pluginPath);
    return this.allowedRoots.some(root => full.startsWith(root));
  }

  execute(plugin) {
    if (!this.validate(plugin.__path)) {
      throw new Error('🧠 SANDBOX BLOCK: plugin outside allowed boundary');
    }
    return plugin;
  }
}

module.exports = new Sandbox();
