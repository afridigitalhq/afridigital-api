async function messageBrain({ from, message }) {
  console.log('📩 MESSAGE RECEIVED:', from, message);

  // 1. Intent detection (simple V1 logic)
  const isAdmin = from === process.env.AFRI_ADMIN_NUMBER;

  if (isAdmin && message.toLowerCase().includes('system health')) {
    return '🧠 System is fully operational (V6.3)';
  }

  if (message.toLowerCase().includes('hello')) {
    return '👋 Welcome to AfriDigital AI';
  }

  // default response
  return '🤖 AfriAI received your message. Processing...';
}

module.exports = { messageBrain };
