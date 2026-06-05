const sandbox = {
  validate: (plugin) => !!plugin
};

const hotswap = {
  loadPlugin: (name) => ({ name, status: 'loaded' }),
  reloadPlugin: (name) => ({ name, status: 'reloaded' }),
  swapPlugin: (name) => ({ name, status: 'swapped' })
};

const control = require('./control-plane');

module.exports = {
  sandbox,
  hotswap,
  control
};
