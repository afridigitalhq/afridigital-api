const { createKernel } = require('./core/kernel/bootstrap');

const kernel = createKernel().start();

// register AI worker
kernel.registry.register("ai", async (job, stream) => {

  console.log("🧠 AI EXEC:", job.text);

  stream.publish("ai.result", {
    traceId: job.traceId,
    reply: "processed in HYBRID v8 brain",
    echo: job.text
  });
});

// route test job
kernel.router.route({
  target: "ai",
  text: "hello hybrid autonomous brain v8",
  traceId: "v8-test-1",
  mode: "local"
});
