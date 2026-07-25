export function HelpIntent(message = "") {
  const text = message.toLowerCase();

  if (
    text.includes("help") ||
    text.includes("what can you do") ||
    text.includes("how can you help") ||
    text.includes("capabilities")
  ) {
    return {
      handled: true,
      reply:
        "I am AfriAI, the intelligence assistant for the AfriDigital ecosystem. I can help you explore products, explain platform features, provide development status updates, explain AfriDesign Studio, and answer roadmap questions."
    };
  }

  return { handled: false };
}

export default HelpIntent;
