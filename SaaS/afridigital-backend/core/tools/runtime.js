const registry = {
  echo: async (args) => ({ echo: args.text }),
  time: async () => ({ time: Date.now() }),
  memory_summary: async () => ({ ok: true })
};

async function runTool(name, args) {
  const tool = registry[name];
  if (!tool) return { error: "Tool not allowed" };

  return await tool(args || {});
}

module.exports = { runTool };
