const { registerTool } = require("./registry");

/**
 * 🔧 EXAMPLE BUILT-IN TOOLS
 */

// echo tool
registerTool(
  "echo",
  {
    text: "string"
  },
  async (input) => {
    return { result: input.text };
  }
);

// time tool
registerTool(
  "time.now",
  {},
  async () => {
    return { now: Date.now() };
  }
);

// memory write tool (safe interface)
registerTool(
  "memory.write",
  {
    user: "string",
    text: "string"
  },
  async (input, ctx) => {
    const memory = require("../memory/store");
    memory.pushMessage(input.user, { text: input.text });

    return { ok: true };
  }
);

console.log("🧰 Built-in tools registered");
