const { createKernel } = require('./core/kernel/bootstrap');

const kernel = createKernel().start();

// register AI cloud worker
kernel.registry.register("ai", async (job, bus) => {

  console.log("🧠 CLOUD AI EXEC:", job.text);

  bus.publish("cloud.result", {
    traceId: job.traceId,
    reply: "processed in AI cloud OS v7",
    echo: job.text
  });

});

// execute cloud job
kernel.executor.execute({
  target: "ai",
  text: "hello AI cloud OS v7",
  traceId: "v7-test-1"
});
