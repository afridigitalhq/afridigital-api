const { createKernel } = require('./core/kernel/bootstrap');

const kernel = createKernel().start();

// scale worker pool
kernel.pool.scale("ai", async (payload, stream) => {

  console.log("🧠 AI v5 EXEC:", payload.text);

  stream.publish("kernel.response", {
    traceId: payload.traceId,
    reply: "processed in v5 full scale brain",
    echo: payload.text
  });

});

// ROUTED EXECUTION (real OS style)
kernel.router.route({
  target: "ai",
  text: "hello full scale distributed brain v5",
  traceId: "v5-test-1"
});
