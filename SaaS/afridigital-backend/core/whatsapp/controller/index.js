/*__WHATSAPP_LOCK__*/
const safeExecute = require("../../kernel/safe.degradation").safeExecute = require('../../flow/engine/runtime');

function detectIntent(text = '') {
  return { primary: text.includes('hello') ? 'greeting' : 'systemFlow' };
}

async function handleMessage(payload = {}) {
  const message = payload.text || payload.body || '';

  const intentRaw = detectIntent(message);
  const intent = (typeof intentRaw === 'string' ? intentRaw : intentRaw?.primary || intentRaw?.intent || 'system');


  const result = await executeFlow(
    ({ greeting: 'greetingFlow', system: 'systemFlow' }[intent] || 'systemFlow'),
    
  );

  return result;
}

module.exports = { handleMessage };