module.exports = {
  handleIncomingMessage: async (job) => {
    const text = (job.message || '').toLowerCase();

    let reply = '🤖 AfriAI received your message.';

    if (text.includes('hello') || text.includes('hi')) {
      reply = '👋 Hello from AfriAI realtime system.';
    }

    if (text.includes('dashboard')) {
      reply = '📊 AfriTrace dashboard is online.';
    }

    if (text.includes('price')) {
      reply = '💰 AfriDigital pricing engine active.';
    }

    return {
      reply,
      from: job.from
    };
  }
};
