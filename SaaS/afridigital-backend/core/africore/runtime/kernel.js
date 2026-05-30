const memory = require("../memory/db");
const brain = require('../../ai/brain');
const router = require("../router");
const tools = require("../tools/init");
const trace = require("./trace");
const logger = require("../observability/logger");
const { guard } = require("../guard/kernelGuard");

module.exports = {
  async run(event) {

    // 🔒 HARD EXECUTION LOCK
    guard(event.type);

    const ctx = trace.create();
    const userId = event.from || event.user;

    logger.info({ traceId: ctx.traceId, step: "kernel_start" });

    const mem = memory.get(userId);

    const ai = await brain.runBrain({
      text: event.text,
      memory: mem
    });

    const actions = router.route(ai);

    const results = [];

    for (const action of actions) {
      const res = await tools.run(action, {
        user: userId,
        input: event.text,
        ai
      }, ctx);

      results.push(res);
    }

    memory.append(userId, {
      text: event.text,
      role: "user"
    });

    memory.setIntent(userId, ai.category);

    logger.info({ traceId: ctx.traceId, step: "kernel_complete" });

    return {
      ok: true,
      traceId: ctx.traceId,
      ai,
      memory: mem,
      actions,
      result: results
    };
  }
};


async function handle(input){
  return await run(input);
}

module.exports.handle = handle;
