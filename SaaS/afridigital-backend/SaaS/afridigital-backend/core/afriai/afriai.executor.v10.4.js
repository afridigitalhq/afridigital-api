const trace = require('../../v10_5/observability/trace.bus.v10.5');
const intent =
require('./afriai.intent.v10.4');

const router =
require('./afriai.finance.router.v10.4');

class AfriAIExecutorV10_4 {

  execute(text, payload={}) {

    const detected =
      intent.detect(text);

    if (!detected.ok) {

      return detected;
    }

    return router.route(
      detected.intent,
      payload
    );
  }

  snapshot() {

    return {
      ok: true,
      status:
        'AFRIAI_FINANCIAL_ASSISTANT_ACTIVE'
    };
  }
}

module.exports =
new AfriAIExecutorV10_4();
