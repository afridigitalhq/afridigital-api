const tools = new Map();

module.exports = {
  register(name, fn) {
    tools.set(name, fn);
  },

  list() {
    return [...tools.keys()];
  },

  async run(name, payload, ctx) {
    const tool = tools.get(name);
    if (!tool) throw new Error("Tool not found: " + name);

    return tool(payload, ctx);
  }
};
