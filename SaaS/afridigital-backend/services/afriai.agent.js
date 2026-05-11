const sendWhatsAppMessage = require('./whatsapp.send');

let OpenAI = null;
let client = null;

// OPTIONAL OPENAI LOAD
try {
  OpenAI = require('openai');

  if (
    process.env.OPENAI_API_KEY &&
    !process.env.OPENAI_API_KEY.includes('your')
  ) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('🧠 OpenAI Provider Loaded');
  } else {
    console.log('⚠️ OpenAI key missing — using internal brain');
  }

} catch (err) {
  console.log('⚠️ OpenAI SDK unavailable');
}

// 🧠 MEMORY ENGINE
const memory = {};

function getMemory(user) {
  if (!memory[user]) {
    memory[user] = {
      history: [],
      personality: 'default'
    };
  }

  return memory[user];
}

// 🧠 INTERNAL AI BRAIN
function internalBrain(message) {

  const lower = message.toLowerCase();

  // JOB ENGINE
  if (
    lower.includes('job') ||
    lower.includes('work') ||
    lower.includes('employment')
  ) {
    return `
💼 AfriAI Job Engine

I can help with:
• Remote jobs
• Tech jobs
• CV guidance
• Freelancing
• African opportunities

Tell me your skill or profession.
`;
  }

  // PAYMENT ENGINE
  if (
    lower.includes('pay') ||
    lower.includes('money') ||
    lower.includes('transfer')
  ) {
    return `
💳 AfriAI Payment Engine

Available actions:
• Send money
• Receive money
• Payment tracking
• Business transactions

What would you like to do?
`;
  }

  // BUSINESS ENGINE
  if (
    lower.includes('business') ||
    lower.includes('startup')
  ) {
    return `
🚀 AfriAI Business Engine

I can help with:
• Startup ideas
• Branding
• Growth plans
• AI business systems
• Monetization

Describe your business idea.
`;
  }

  // CODING ENGINE
  if (
    lower.includes('code') ||
    lower.includes('website') ||
    lower.includes('app')
  ) {
    return `
💻 AfriAI Dev Engine

Supported:
• Node.js
• React
• APIs
• WhatsApp bots
• AI systems
• Full-stack apps

Tell me what you want to build.
`;
  }

  // DEFAULT
  return `
🤖 AfriAI Internal Brain

I understand your message:
"${message}"

How can I assist you further?
`;
}

// 🚀 REAL AI THINKING
async function think(message, userMemory) {

  // USE OPENAI IF AVAILABLE
  if (client) {

    try {

      const completion =
        await client.chat.completions.create({
          model: 'gpt-4.1-mini',

          messages: [
            {
              role: 'system',
              content: `
You are AfriAI.

You are futuristic,
helpful,
African-tech focused,
and conversational.
`
            },

            ...userMemory.history.slice(-10),

            {
              role: 'user',
              content: message
            }
          ],

          temperature: 0.7
        });

      return completion
        .choices[0]
        .message.content;

    } catch (err) {

      console.log(
        '⚠️ OpenAI failed — switching to internal brain'
      );

      return internalBrain(message);
    }
  }

  // INTERNAL BRAIN FALLBACK
  return internalBrain(message);
}

// 🚀 MAIN AGENT
async function AfriAIAgent(message, from) {

  const userMemory = getMemory(from);

  // STORE USER MESSAGE
  userMemory.history.push({
    role: 'user',
    content: message
  });

  // THINK
  const reply =
    await think(message, userMemory);

  // STORE AI REPLY
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
