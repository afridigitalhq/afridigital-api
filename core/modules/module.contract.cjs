function createModule(def) {
  if (!def || !def.id) throw new Error('MODULE INVALID: missing id');

  return {
    ...def,

    __validate() {
      return (
        typeof def.id === 'string' &&
        typeof def.init === 'function'
      );
    }
  };
}

module.exports = { createModule };
