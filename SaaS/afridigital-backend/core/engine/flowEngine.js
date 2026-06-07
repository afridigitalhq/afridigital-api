async function flowEngine(message) {
  const text = (message.text || "").toLowerCase();

  if (text.includes("hello")) return "reply: hello 👋";
  if (text.includes("help")) return "reply: how can I assist?";

  return "reply: message received";
}

module.exports = { flowEngine };
