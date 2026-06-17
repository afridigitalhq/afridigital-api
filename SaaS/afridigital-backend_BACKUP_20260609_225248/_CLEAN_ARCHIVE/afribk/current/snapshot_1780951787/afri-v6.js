const { createKernel } = require('./core/kernel/bootstrap');

const kernel = createKernel().start();

// register worker on cluster
kernel.registry.register("ai", async (job, bus) => {

  console.log("🧠 CLUSTER AI EXEC:", job.text);

  bus.publish("cluster.result", {
    traceId: job.traceId,
    reply: "processed in distributed cluster v6",
    echo: job.text
  });

});

// simulate cluster job
kernel.executor.submit({
  traceId: "v6-test-1",
  text: "hello distributed cluster brain"
});
