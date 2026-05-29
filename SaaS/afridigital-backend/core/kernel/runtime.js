const { runOrchestrator } = require("../orchestrator/engine");
const memory = require("../memory/store");

/**
 * 🧠 OS RUNTIME KERNEL
 * single entry point for ALL AI execution
 */
async function runKernel(req) {

  const traceId = req.traceId || Math.random().toString(36).slice(2,10);

  console.log(`🧠 [OS:${traceId}] REQUEST`, req.text);

  // 1. MEMORY LOAD
  const context = memory.getContext(req.from);

  // 2. ORCHESTRATION
  const result = await runOrchestrator({
    user: req.from,
    text: req.text,
    context,
    traceId
  });

  // 3. MEMORY WRITEBACK
  memory.pushMessage(req.from, {
    text: req.text,
    result: result.reply
  });

  return {
    traceId,
    ...result
  };
}

module.exports = { runKernel };
