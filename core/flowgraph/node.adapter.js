function adapt(name, mod) {

  // FUNCTION MODULE
  if (typeof mod === 'function') {
    return {
      name,
      type: 'function',
      invoke: mod,
      meta: {}
    };
  }

  // OBJECT MODULE (your orchestrator + flowgraph)
  if (mod && typeof mod === 'object') {
    return {
      name,
      type: 'object',
      invoke: async (method, ...args) => {
        if (typeof mod[method] === 'function') {
          return await mod[method](...args);
        }
        throw new Error(`Method ${method} not found on ${name}`);
      },
      meta: Object.keys(mod)
    };
  }

  return {
    name,
    type: 'unknown',
    invoke: () => null,
    meta: {}
  };
}

module.exports = { adapt };
