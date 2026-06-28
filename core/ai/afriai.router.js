/**
 * AFRIAI PURE LOGIC LAYER
 * No OS imports allowed
 */

function routeMessage(input) {
  const text = (input.message || "").toLowerCase();

  if (text.includes("hello")) {
    return "Hello from AfriAI 👋";
  }

  if (text.includes("status")) {
    return "System operational 🟢";
  }

  return "AfriAI received your message ✔";
}

module.exports = { routeMessage };
