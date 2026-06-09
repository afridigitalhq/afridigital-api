const { createKernel } = require('./core/kernel/bootstrap');

const kernel = createKernel().start();

// register AI worker
kernel.registry.register("ai", async (payload, bus) => {
  console.log("🧠 AI EXEC:", payload.text);

  bus.publish("kernel.response", {
    traceId: payload.traceId,
    reply: "AI processed task",
    echo: payload.text
  });
});

// register event worker
kernel.registry.register("events", async (payload) => {
  console.log("⚡ EVENT:", payload);
});

// test flow
setTimeout(() => {
  kernel.dispatcher.dispatch("ai", {
    text: "hello brain v3",
    traceId: "v3-test"
  });
}, 1000);
