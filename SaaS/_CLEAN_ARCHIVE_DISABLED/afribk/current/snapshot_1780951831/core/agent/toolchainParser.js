function extractToolChain(text = "") {
  try {
    const match = text.match(/```json([\s\S]*?)```/);

    if (!match) return null;

    const parsed = JSON.parse(match[1]);

    if (!Array.isArray(parsed)) return null;

    return parsed.filter(step => step.tool);

  } catch (err) {
    return null;
  }
}

module.exports = {
  extractToolChain
};
