const { assertApiVersion } = require("../runtime/safety/api.guard");
const OpenAI = require("openai");
const memory = require("../../modules/memory");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function handle({ from, text }) {
  const history = await memory.get(from) || [];

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are AfriDigital WhatsApp AI. Be concise, helpful, and intelligent." },
      ...history,
      { role: "user", content: text }
    ]
  });

  const reply = res.choices[0].message.content;

  await memory.push(from, { role: "user", content: text });
  await memory.push(from, { role: "assistant", content: reply });

  return reply;
}

module.exports = { handle };
