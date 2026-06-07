const { getFlow } = require('./registry');

async function executeFlow(payload, context = {}) {
  const text = payload?.text || '';

  let flowName = 'systemFlow';

  if (text.includes('hello')) {
    flowName = 'greetingFlow';
  }

  const flow = getFlow(flowName);

  if (!flow) {
    return {
      ok: false,
      flow: 'unknownFlow',
      result: 'Flow not found'
    };
  }

  return await flow(payload, context);
}

module.exports = { executeFlow };
