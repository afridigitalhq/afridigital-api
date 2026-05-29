/**
 * TOOL REGISTRY v1
 * Central catalog of all executable tools
 */

const tools = {
  echoTool: {
    description: "Returns input text",
    execute: async ({ text }) => {
      return { ok: true, result: text };
    }
  },

  pricingTool: {
    description: "Mock pricing lookup tool",
    execute: async () => {
      return { ok: true, result: "Standard pricing: $10" };
    }
  },

  supportTool: {
    description: "Mock support routing tool",
    execute: async () => {
      return { ok: true, result: "Support ticket created" };
    }
  }
};

function getTool(name) {
  return tools[name] || null;
}

function listTools() {
  return Object.keys(tools);
}

module.exports = {
  getTool,
  listTools
};
