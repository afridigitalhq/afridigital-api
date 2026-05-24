const stream = require("../streams/redis.stream.cjs");

console.log("🧠 AI GLOBAL WORKER ONLINE");

stream.consume(async (event, payload) => {

  if (event === "MESSAGE_RECEIVED") {
    await stream.emit("THOUGHT_GENERATED", {
      input: payload.text
    });
  }

  if (event === "THOUGHT_GENERATED") {
    await stream.emit("RESPONSE_GENERATED", {
      text: "AI V14: " + payload.input
    });
  }

});
