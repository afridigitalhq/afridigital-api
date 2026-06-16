require('../../kernel/v18_4/bootstrap');
require('../../kernel/v18_3/bootstrap');
require('../../kernel/v18_2/bootstrap');
require('../../kernel/bootstrap');
require('../../kernel/bootstrap');
require('../kernel/wrap-require');
const { executeFlow } = require("../../flow/bridge/execute");

module.exports = async function router(plan, ctx) {
  const flowResult = await executeFlow(plan, ctx);

  return {
    ok: true,
    flow: plan,
    output: flowResult.result,
    raw: flowResult
  };
};
