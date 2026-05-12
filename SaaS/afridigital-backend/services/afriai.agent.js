const { assertApiVersion } = require("../runtime/safety/api.guard");
const sendWhatsAppMessage = require('./whatsapp.send');
const { handleAdminCommand } = require('../core/admin.engine');
const adEngine = require('./ad.engine');

// MEMORY ENGINE
const memory = {};

function getMemory(user) {
  if (!memory[user]) {
    memory[user] = {
      history: []
    };
  }

  return memory[user];
}

// SIMPLE INTERNAL AI BRAIN
async function think(message) {

  const text = message.toLowerCase();

  if (text.includes('job')) {
    return '💼 AfriAI Job Engine activated. What kind of work are you looking for?';
  }

  if (
    text.includes('money') ||
    text.includes('earn') ||
    text.includes('income')
  ) {
    return '💰 AfriAI Income Engine activated. I can help you discover online earning opportunities.';
  }

  if (
    text.includes('tiktok') ||
    text.includes('followers') ||
    text.includes('viral')
  ) {
    return '🚀 AfriAI Creator Engine activated. Let us grow your audience.';
  }

  return `🤖 AfriAI received: ${message}`;
}

// SHOULD INJECT ADS?
function shouldInjectAd(message) {

  const text = message.toLowerCase();

  return (
    text.includes('money') ||
    text.includes('earn') ||
    text.includes('job') ||
    text.includes('tiktok') ||
    text.includes('viral') ||
    text.includes('followers') ||
    text.includes('income')
  );
}

// MAIN AGENT LOOP
async function AfriAIAgent(message, from) {

  // 👑 ADMIN LAYER
  const adminReply = await handleAdminCommand(from, message);
  if (adminReply) {
    console.log("👑 ADMIN RESPONSE:", adminReply);
    await sendWhatsAppMessage(from, adminReply);
    return adminReply;
  }

  const userMemory = getMemory(from);

  // STORE USER MESSAGE
  userMemory.history.push({
    role: 'user',
    content: message
  });

  // AI THINK
  const reply = await think(message);

  // STORE AI REPLY
  userMemory.history.push({
    role: 'assistant',
    content: reply
  });

  console.log('🧠 MEMORY:', userMemory.history);
  console.log('🚀 AI REPLY:', reply);

  // SEND MAIN REPLY
  await sendWhatsAppMessage(from, reply);

  // OPTIONAL AD INJECTION
  if (shouldInjectAd(message)) {

    const ad = adEngine.getRandomAd();

    if (ad) {

      const adCard = adEngine.buildAdCard(ad);

      console.log('📢 INJECTING AD:', ad.title);

      await sendWhatsAppMessage(from, adCard);
    }
  }

  return reply;
}

module.exports = AfriAIAgent;
