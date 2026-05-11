const OpenAI = require('openai');

const sendWhatsAppMessage = require('./whatsapp.send');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 MEMORY ENGINE
const memory = {};

function getMemory(user) {
  if (!memory[user]) {
    memory[user] = {
      history: []
    };
  }

  return memory[user];
}

// 🚀 REAL AI BRAIN
async function think(message, userMemory) {

  const messages = [
    {
      role: 'system',
      content: `
You are AfriAI.

You are intelligent, conversational, futuristic,
helpful, emotionally aware, and African-tech focused.

You assist users with:
- jobs
- payments
- business
- coding
- media
- AI tools
- productivity
- daily conversations

Keep replies concise and natural for WhatsApp.
`
    },

    // memory history
    ...userMemory.history.slice(-10),

    // latest message
    {
      role: 'user',
      content: message
    }
  ];

  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages,
    temperature: 0.7
  });

  return completion.choices[0].message.content;
}

// 🧠 MAIN AGENT LOOP
async function AfriAIAgent(message, from) {

  const userMemory = getMemory(from);

  // STORE USER MESSAGE
  userMemory.history.push({
    role: 'user',
    content: message
  });

  // THINK
  const reply = await think(message, userMemory);

  // STORE AI RESPONSE
  userMemory.history.push({
    role: 'assistant',
    content: reply
  });

  console.log('🧠 MEMORY:', userMemory.history);
  console.log('🚀 AI REPLY:', reply);

  // SEND TO WHATSAPP
  await sendWhatsAppMessage(from, reply);

  return reply;
}

module.exports = AfriAIAgent;
