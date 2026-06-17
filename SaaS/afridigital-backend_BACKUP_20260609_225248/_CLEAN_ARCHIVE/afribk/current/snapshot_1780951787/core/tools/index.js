async function pricingTool(args = {}) {
  return {
    ok: true,
    pricing: {
      starter: "$9",
      pro: "$29"
    }
  };
}

async function supportTool(args = {}) {
  return {
    ok: true,
    ticket: `SUP-${Date.now()}`
  };
}

async function echoTool(args = {}) {
  return {
    ok: true,
    echo: args.message || ""
  };
}

const tools = {
  pricingTool,
  supportTool,
  echoTool
};

async function executeTool(name, args) {
  const tool = tools[name];

  if (!tool) {
    return {
      ok: false,
      error: `Unknown tool: ${name}`
    };
  }

  return await tool(args);
}

module.exports = {
  executeTool,
  tools
};
