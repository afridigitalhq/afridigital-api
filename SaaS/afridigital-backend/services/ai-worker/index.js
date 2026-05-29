const bus = require('../../core/events/bus');

bus.on("message.incoming", async (msg) => {
  console.log("🧠 AI WORKER PROCESSING:", msg.text);

  // placeholder AI logic
  const reply = `Echo: ${msg.text}`;

  bus.emit("message.outgoing", {
    to: msg.from,
    text: reply
  });
});
