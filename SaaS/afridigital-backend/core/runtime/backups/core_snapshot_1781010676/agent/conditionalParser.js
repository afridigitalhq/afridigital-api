function extractConditionalFlow(text = "") {
  try {
    const match = text.match(/```json([\s\S]*?)```/);

    if (!match) return null;

    const parsed = JSON.parse(match[1]);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed;

  } catch (err) {
    return null;
  }
}

module.exports = {
  extractConditionalFlow
};
