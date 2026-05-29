const axios = require("axios");

/**
 * 🧠 LLM PROVIDER (PLUG & PLAY)
 * - OpenAI optional
 * - fallback mock local model
 */

async function callLLM({ role, prompt }) {

  // 🔌 OPENAI HOOK (optional)
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: role },
            { role: "user", content: prompt }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
          }
        }
      );

      return res.data.choices[0].message.content;
    } catch (e) {
      console.log("⚠️ OpenAI failed, fallback to local model");
    }
  }

  // 🧠 LOCAL FALLBACK MODEL (no dependency)
  return `[${role.toUpperCase()} LOCAL LLM]: ${prompt}`;
}

module.exports = { callLLM };
