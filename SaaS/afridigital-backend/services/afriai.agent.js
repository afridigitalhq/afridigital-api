const sendWhatsAppMessage = require('./whatsapp.send');

// 🧠 SIMPLE MEMORY STORE
const memory = {};

function getMemory(user) {
  if (!memory[user]) {
    memory[user] = {
      history: [],
      context: {}
    };
  }

  return memory[user];
}

// 🧠 AI THINKING ENGINE
async function think(message, userMemory) {
  const lower = message.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi')) {
    return '👋 Hello, I am AfriAI. How can I assist you today?';
  }

  if (lower.includes('job')) {
    return '💼 AfriAI Job Engine activated. What kind of job are you looking for?';
  }

  if (
    lower.includes('pay') ||
    lower.includes('money') ||
    lower.includes('transfer')
  ) {
    return '💳 Payment Engine detected. Do you want to send or receive money?';
  }

  if (
    lower.includes('image') ||
    lower.includes('photo') ||
    lower.includes('video')
  ) {
    return '🖼️ Media Engine ready. Upload or describe the media you want processed.';
  }

  return `🤖 AfriAI understands: "${message}"`;
}

// 🚀 MAIN AGENT LOOP
async function AfriAIAgent(message, from) {
  const userMemory = getMemory(from);

  // STORE USER MESSAGE
  userMemory.history.push({
    role: 'user',
    message
  });

  console.log('🧠 MEMORY STATE:', userMemory.history);

  // THINK
  const reply = await think(message, userMemory);

  // STORE AI RESPONSE
  userMemory.history.push({
    role: 'assistant',
    message: reply
  });

  console.log('🚀 AI REPLY:', reply);

  // SEND WHATSAPP MESSAGE
  await sendWhatsAppMessage(from, reply);

  return reply;
}

module.exports = AfriAIAgent;
