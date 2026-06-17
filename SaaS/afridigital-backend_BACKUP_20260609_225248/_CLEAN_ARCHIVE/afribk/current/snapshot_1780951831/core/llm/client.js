async function callLLM(prompt) {
  // 🔥 REPLACE LATER WITH REAL MODEL (OpenAI / HF / local)
  // for now deterministic mock

  if (prompt?.includes("tool")) {
    return JSON.stringify({
      type: "final",
      reply: "Tool execution completed successfully."
    });
  }

  return JSON.stringify({
    type: "final",
    reply: "Echo from orchestrator v2"
  });
}

module.exports = { callLLM };
