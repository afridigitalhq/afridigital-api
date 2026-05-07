const spine = require("../spine/redis.spine.cjs");

console.log("🧠 AI NODE ONLINE");

spine.on("MESSAGE_RECEIVED", (msg) => {
  spine.emit("THOUGHT_GENERATED", {
    input: msg.text,
    node: "ai-node"
  });
});

spine.on("THOUGHT_GENERATED", (t) => {
  spine.emit("RESPONSE_GENERATED", {
    text: "AI: " + t.input,
    node: "ai-node"
  });
});
