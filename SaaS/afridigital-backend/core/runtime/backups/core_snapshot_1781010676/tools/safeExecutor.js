const tools = require('./registry');
const { isAllowed } = require('./policy');

async function safeExecute(traceId, tool, input) {
  if (!isAllowed(tool)) {
    return { error: "tool_not_allowed", tool };
  }

  const fn = tools[tool];

  if (!fn) {
    return { error: "tool_not_found", tool };
  }

  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("tool_timeout")), 2000)
    );

    const result = await Promise.race([
      fn(input),
      timeout
    ]);

    return { ok: true, result };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = { safeExecute };
