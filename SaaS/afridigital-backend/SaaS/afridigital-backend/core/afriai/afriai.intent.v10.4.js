const trace = require('../../v10_5/observability/trace.bus.v10.5');
class AfriAIIntentV10_4 {

  detect(text="") {

    const input =
      text.toLowerCase();

    if (
      input.includes('monthly') &&
      input.includes('report')
    ) {

      return {
        ok: true,
        intent:
          'GENERATE_MONTHLY_REPORT'
      };
    }

    if (
      input.includes('weekly') &&
      input.includes('summary')
    ) {

      return {
        ok: true,
        intent:
          'GENERATE_WEEKLY_SUMMARY'
      };
    }

    if (
      input.includes('failed') &&
      input.includes('transaction')
    ) {

      return {
        ok: true,
        intent:
          'FAILED_TRANSACTION_ANALYTICS'
      };
    }

    return {
      ok: false,
      error: 'intent_not_recognized'
    };
  }
}

module.exports =
new AfriAIIntentV10_4();
