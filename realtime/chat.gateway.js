const bus = require("./event.stream");

bus.on("CHAT_FLOW", (data) => {
  console.log("🧠 CHAT FLOW EVENT:", {
    intent: data.intent,
    route: data.route
  });
});

module.exports = bus;
