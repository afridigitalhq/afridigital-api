const bus = require("../../afridigital-core/kernel/event-bus/bus.cjs");

bus.onEvent("ai.thought_generated", (data) => {
  console.log("🧠 AI REACTOR:", data);

  bus.emitEvent("ai.memory_written", {
    memory: data.thought
  });
});
