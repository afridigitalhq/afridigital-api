const { assertApiVersion } = require("../runtime/safety/api.guard");

async function messageBrain({ from, message }) {
  console.log('🧠 BRAIN INPUT:', from, message);

  try {
    const text = (message || '').toLowerCase();

    // --- MINI ROUTER (SAFE INTELLIGENCE LAYER) ---
    let reply;

    if (text.includes('hello') || text.includes('hi')) {
      reply = '👋 Hey! AfriAI is live and listening.';
    } 
    else if (text.includes('help')) {
      reply = '🛠 I can respond to messages, process requests, and evolve with your system.';
    } 
    else if (text.includes('time')) {
      reply = `⏰ Current server time: ${new Date().toISOString()}`;
    } 
    else {
      reply = `🤖 I received: "${message}". System is active and processing.`;
    }

    console.log('📤 AI RESPONSE:', reply);

    return { reply };

  } catch (err) {
    console.error('❌ BRAIN ERROR:', err);
    return { reply: '⚠️ Brain temporarily unavailable' };
  }
}

module.exports = { messageBrain };
