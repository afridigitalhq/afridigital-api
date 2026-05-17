const tools = require('../../../core/tools');

async function runTool(tool, args, timeout = 3000) {
  return Promise.race([
    tool(args),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("TOOL_TIMEOUT")), timeout)
    )
  ]);
}

module.exports = {
  async dispatch(task) {
    const results = [];

    if (!task?.tools?.length) {
      return { ok: false, error: "NO_TOOLS_FOUND" };
    }

    for (const t of task.tools) {
      const tool = tools[t.name];

      if (!tool) {
        results.push({
          tool: t.name,
          ok: false,
          error: "TOOL_NOT_FOUND"
        });
        continue;
      }

      try {
        const output = await runTool(tool, t.args);

        results.push({
          tool: t.name,
          ok: true,
          output
        });

      } catch (e) {
        results.push({
          tool: t.name,
          ok: false,
          error: e.message
        });
      }
    }

    return {
      ok: true,
      executed: results
    };
  }
};
