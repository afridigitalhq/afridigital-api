/**
 * AFRIDIGITAL MODULE CONTRACT
 * ZERO-DRIFT PLUGIN SPEC
 */

module.exports = {
  createModule: function (config) {
    if (!config || typeof config !== 'object') {
      throw new Error('MODULE CONTRACT VIOLATION: invalid config');
    }

    const required = ['id', 'name', 'version', 'init'];

    for (const k of required) {
      if (!config[k]) {
        throw new Error(`MODULE CONTRACT VIOLATION: missing ${k}`);
      }
    }

    return {
      id: config.id,
      name: config.name,
      version: config.version,

      status: 'registered',

      init: config.init,

      start: config.start || (() => {}),
      stop: config.stop || (() => {}),

      hooks: config.hooks || {},

      meta: config.meta || {},

      __validate() {
        return (
          typeof this.init === 'function' &&
          typeof this.start === 'function' &&
          typeof this.stop === 'function'
        );
      }
    };
  }
};
