const { assertApiVersion } = require("../runtime/safety/api.guard");
const axios = require("axios");

/**
 * AfriDigital AI Engine
 * External AI-powered WhatsApp brain
 */
async function generateAIResponse(message) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are AfriDigital AI assistant. You help users with business, tech, support, and automation tasks in a concise and helpful way."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("AI ERROR:", err.message);
    return "Sorry, I couldn't process that right now.";
  }
}

module.exports = { generateAIResponse };
