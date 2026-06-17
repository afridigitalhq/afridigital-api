const { createKernel } = require('./core/kernel/bootstrap');

const kernel = createKernel().start();

// register AI worker (stateless distributed unit)
kernel.registry.register("ai", async (payload, stream) => {

  console.log("🧠 AI NODE EXEC:", payload.text);

  stream.publish("kernel.response", {
    traceId: payload.traceId,
    reply: "AI processed in v4",
    echo: payload.text
  });

});

// simulate distributed dispatch
setTimeout(() => {
  kernel.executor.execute({
    target: "ai",
    payload: {
      text: "hello distributed brain v4",
      traceId: "v4-test-1"
    }
  });
}, 1000);
