const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function summarize(messages) {
  const input = messages.map(m => m.msg).join("\n");

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Summarize conversation into intent, memory, and goals."
      },
      {
        role: "user",
        content: input
      }
    ]
  });

  return res.choices[0].message.content;
}

async function reason(context, message) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a reasoning engine inside an AI swarm. Respond concisely."
      },
      {
        role: "user",
        content: JSON.stringify({ context, message })
      }
    ]
  });

  return res.choices[0].message.content;
}

module.exports = { summarize, reason };
