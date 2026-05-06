const { writeMemory } = require('../memory-core/memoryWriter');
const { search } = require('../memory-recall/semanticSearch');

async function handleIncomingMessage({ userId, message, channel }) {
  // 1. STORE MEMORY
  writeMemory({ userId, text: message, meta: { channel } });

  // 2. RECALL MEMORY
  const memories = search(message);

  // 3. BUILD CONTEXT
  const context = memories.map(m => m.text).join('\n');

  // 4. CALL AI ROUTER
  const aiRouter = require('../ai-engine/router');
  const response = await aiRouter({
    message: context + '\nUser: ' + message,
    channel,
    from: userId
  });

  // 5. STORE RESPONSE TOO
  writeMemory({ userId, text: response, meta: { channel, type: 'ai' } });

  return response;
}

module.exports = { handleIncomingMessage };
