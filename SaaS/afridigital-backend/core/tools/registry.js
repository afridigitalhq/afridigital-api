const tools = {
  echo: async (input) => ({ ok: true, result: input }),
};

function getTool(name) {
  return tools[name];
}

module.exports = { getTool };
