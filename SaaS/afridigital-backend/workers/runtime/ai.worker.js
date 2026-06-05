const { registerWorker } = require('../../core/afriai/registry/workerRegistry');

console.log("🚀 AI WORKER STARTING...");

registerWorker("ai-worker-1", async (event) => {
  console.log("🧠 EXEC:", event.traceId);

  return {
    reply: "AI processed task",
    echo: event.text,
    worker: "ai-worker-1"
  };
});

console.log("✅ AI WORKER READY");
