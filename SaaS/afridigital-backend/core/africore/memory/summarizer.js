const brain = require('../ai/brain');

/**
 * Compress long memory into a stable summary
 */
async function summarize(history = []){

  if(history.length < 6){
    return {
      summary: "New user - limited interaction history.",
      intent: "unknown"
    };
  }

  const text = history
    .map(h => `${h.role || "user"}: ${h.text}`)
    .join("\n");

  try {

    const result = await brain.think({
      text: `
Summarize this user conversation into JSON:

{
  "summary": "short behavioral summary",
  "intent": "primary user intent"
}

Conversation:
${text}
      `
    });

    // fallback-safe parsing
    try {
      return JSON.parse(result.response || "{}");
    } catch {
      return {
        summary: result.response || "unstructured summary",
        intent: "unknown"
      };
    }

  } catch (e){
    return {
      summary: "summary failed",
      intent: "unknown"
    };
  }
}

module.exports = { summarize };
