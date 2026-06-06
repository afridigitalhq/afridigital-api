export const toolSandbox = {
  run(tool, payload) {
    const whitelist = ["logs", "ui", "flowgraph", "system"];

    if (!whitelist.includes(tool)) {
      throw new Error("BLOCKED_TOOL_EXECUTION");
    }

    return {
      tool,
      status: "executed",
      payload
    };
  }
};
