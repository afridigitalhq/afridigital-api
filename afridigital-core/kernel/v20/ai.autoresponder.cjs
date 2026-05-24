function generateReply(message, decision) {
  const text = (message.text || "").toLowerCase();

  if (decision.action === "DROP") return null;

  if (decision.agent === "SupportAgent") {
    return "I understand the issue — please share more details so I can help you resolve it.";
  }

  if (decision.agent === "SalesAgent") {
    return "Thanks for your interest 👍 Let me share the best option for you.";
  }

  if (text.includes("hello")) {
    return "Hello 👋 I’m AfriAI. How can I help you today?";
  }

  if (text.includes("thanks")) {
    return "You're welcome 😊";
  }

  return "Got it 👍 Let me process that for you.";
  if (decision.conversion?.action === "PAYMENT_FLOW") {
    return decision.offer + " 🚀";
  }
  if (decision.conversion?.action === "NURTURE") {
    return decision.offer;
  }
}

module.exports = { generateReply };
