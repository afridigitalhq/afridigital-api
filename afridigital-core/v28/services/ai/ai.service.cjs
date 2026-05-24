const { subscribe, publish } = require("../../events/event.bus.cjs");

subscribe("AI_RESPONSE_REQUESTED", (data) => {
  const response = "AI: " + data.message;

  publish("AI_RESPONSE_READY", {
    userId: data.userId,
    response
  });

  publish("REWARD_CREDIT", {
    userId: data.userId,
    amount: 0.2
  });
});
