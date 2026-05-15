const reports =
require('../reporting/report.generator.v10.1');

const dispatch =
require('../dispatch/dispatch.router.v10.3');

class AfriAIFinanceRouterV10_4 {

  route(intent, payload={}) {

    switch(intent) {

      case 'GENERATE_MONTHLY_REPORT': {

        const report =
          reports.generateUserReport(
            payload.userId || 'guest',
            'monthly'
          );

        return dispatch.route(
          payload.channel || 'whatsapp',
          {
            to:
              payload.to || '+234000000000',

            message:
              'Monthly report generated successfully.'
          }
        );
      }

      case 'GENERATE_WEEKLY_SUMMARY': {

        const report =
          reports.generateAdminReport(
            'weekly'
          );

        return dispatch.route(
          payload.channel || 'email',
          {
            to:
              payload.to ||
              'admin@afridigital.local',

            subject:
              'Weekly Financial Summary',

            body:
              JSON.stringify(
                report.report.metrics,
                null,
                2
              )
          }
        );
      }

      case 'FAILED_TRANSACTION_ANALYTICS': {

        const admin =
          reports.generateAdminReport(
            'monthly'
          );

        return {
          ok: true,
          analytics:
            admin.report.metrics
        };
      }

      default:

        return {
          ok: false,
          error: 'unsupported_intent'
        };
    }
  }
}

module.exports =
new AfriAIFinanceRouterV10_4();
