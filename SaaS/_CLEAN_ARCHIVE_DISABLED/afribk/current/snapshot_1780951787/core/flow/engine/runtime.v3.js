const { routeIntent } = require('../../kernel/intent.router.v3');

async function executeFlow(payload) {
  const flow = routeIntent(payload?.text || '');

  if (flow === 'greetingFlow') {
    return {
      ok: true,
      flow,
      result: 'Flow completed ✅'
    };
  }

  if (flow === 'systemFlow') {
    return {
      ok: false,
      flow,
      result: 'System failure simulated'
    };
  }

  return {
    ok: false,
    flow: 'unknownFlow',
    result: 'Flow not found'
  };
}

module.exports = { executeFlow };
