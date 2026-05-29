async function callLLM(prompt) {
  /**
   * REAL LLM ADAPTER (SAFE FALLBACK)
   * If OPENAI_KEY exists → use real model
   * else → fallback deterministic engine
   */

  if (process.env.OPENAI_API_KEY) {
    const fetch = require("node-fetch");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        stream: false
      })
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "LLM_ERROR";
  }

  // fallback engine (no external cost)
  return "FALLBACK: " + prompt.slice(0, 120);
}

module.exports = { callLLM };
