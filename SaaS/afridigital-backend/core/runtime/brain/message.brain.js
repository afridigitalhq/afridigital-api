async function messageBrain({ from, message }) {

  console.log('🧠 BRAIN INPUT:', from, message);

  try {

    // SAFE MOCK RESPONSE (NO CRASH ZONE)
    return {
      reply: '👋 Welcome to AfriDigital AI (safe mode active)'
    };

  } catch (err) {

    console.error('❌ BRAIN ERROR:', err);

    return {
      reply: '⚠️ Brain temporarily unavailable'
    };

  }
}

module.exports = { messageBrain };
