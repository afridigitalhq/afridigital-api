console.log("🧠 AFRI AI BRAIN BOOTING...");

const { registerWorker } = require('../registry/workerRegistry');
const { publish } = require('../../africore/mesh/producer');
const { waitForReply } = require('../../africore/runtime/promiseStore');

/**
 * INTERNAL WORKER BOOTSTRAP
 */
function startWorkers() {
  registerWorker("ai-core-1", async (event) => {
    console.log("🧠 EXEC:", event.traceId);

    return {
      reply: "AI processed task",
      echo: event.text,
      worker: "ai-core-1"
    };
  });

  registerWorker("ai-core-2", async (event) => {
    return {
      reply: "secondary brain node",
      traceId: event.traceId
    };
  });

  console.log("✅ ALL WORKERS REGISTERED");
}

/**
 * CORE BOOT FUNCTION
 */
async function boot() {
  startWorkers();

  const id = "boot-sequence-1";

  publish({
    from: "system",
    text: "boot test",
    traceId: id
  });

  const res = await waitForReply(id, 5000);

  console.log("🚀 BRAIN READY:", res);
}

boot();
