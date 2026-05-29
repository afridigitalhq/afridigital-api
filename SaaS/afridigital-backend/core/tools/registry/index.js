/**
 * 🧰 TOOL REGISTRY
 * central catalog of all executable functions
 */

const tools = new Map();

function registerTool(name, schema, fn) {
  tools.set(name, { schema, fn });
}

function getTool(name) {
  return tools.get(name);
}

function listTools() {
  return [...tools.keys()];
}

module.exports = {
  registerTool,
  getTool,
  listTools
};
