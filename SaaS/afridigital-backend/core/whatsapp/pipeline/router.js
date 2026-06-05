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
