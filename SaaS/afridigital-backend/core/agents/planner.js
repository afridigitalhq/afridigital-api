function plan(input) {
  const text = input.text || "";

  const needsTool =
    text.includes("time") ||
    text.includes("calculate") ||
    text.includes("echo");

  return {
    steps: ["interpret", needsTool ? "tool" : "respond"],
    intent: needsTool ? "tool_required" : "chat"
  };
}

module.exports = { plan };
