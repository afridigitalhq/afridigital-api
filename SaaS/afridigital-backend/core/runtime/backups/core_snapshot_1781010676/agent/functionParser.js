function extractToolCall(text = "") {
  try {
    const match = text.match(/```json([\s\S]*?)```/);

    if (!match) return null;

    const parsed = JSON.parse(match[1]);

    if (!parsed.tool) return null;

    return {
      tool: parsed.tool,
      args: parsed.args || {}
    };

  } catch (err) {
    return null;
  }
}

module.exports = {
  extractToolCall
};
