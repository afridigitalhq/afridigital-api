const bus = require("../../afridigital-core/kern../../afridigital-core/kernel/events/bus.cjs");

bus.onEvent("ai.thought_generated", (data) => {
  console.log("🧠 AI REACTOR:", data);

  bus.emitEvent("ai.memory_written", {
    memory: data.thought
  });
});
