const trace = require("./trace");
const workflow = require("./workflow");
const logger = require("../observability/logger");
const brain = require("../ai/brain");
const memory = require("../memory/db");
const router = require("../router");
const tools = require("../tools/init");

module.exports = {
  async dispatch(event) {
    const ctx = trace.create();
    const userId = event.user;

    logger.info({ traceId: ctx.traceId, action: "event_received" });

    const mem = memory.get(userId);

    const ai = await brain.think({
      ...event,
      memory: mem
    });

    memory.append(userId, { text: event.text, role: "user" });
    memory.setIntent(userId, ai.category);

    const actions = router.route(ai);

    let toolResults = [];

    for (const a of actions) {
      if (a === "send_message") {
        const res = await tools.run("send_message", {
          to: userId,
          text: ai.response
        }, ctx);

        toolResults.push(res);
      }
    }

    const wf = await workflow.execute({
      name: "defaultWorkflow",
      steps: []
    }, ctx);

    logger.info({ traceId: ctx.traceId, action: "workflow_complete" });

    return {
      ok: true,
      traceId: ctx.traceId,
      ai,
      memory: mem,
      actions,
      tools: toolResults,
      result: wf
    };
  }
};
