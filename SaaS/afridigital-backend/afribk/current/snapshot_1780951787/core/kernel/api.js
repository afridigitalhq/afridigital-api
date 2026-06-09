
const kernel = require('./index');

module.exports = {
  config: kernel.config,
  runtime: kernel.runtime,
  registry: kernel.registry,
  resolve: kernel.resolve
};
