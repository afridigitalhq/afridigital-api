module.exports = {
  fallbackResponse: async (job) => ({
    reply: '🤖 AfriAI recovery mode active.',
    from: job.from
  })
};
