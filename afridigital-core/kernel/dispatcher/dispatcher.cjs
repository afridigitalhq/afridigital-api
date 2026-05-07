const bus = require("../event-bus/bus.cjs");

function registerCoreFlows() {

  bus.on("MESSAGE_RECEIVED", (msg) => {
    bus.emit("THOUGHT_GENERATED", { input: msg.text });
  });

  bus.on("THOUGHT_GENERATED", (t) => {
    bus.emit("RESPONSE_GENERATED", {
      text: "AI Response: " + t.input
    });
  });

  bus.on("RESPONSE_GENERATED", (res) => {
    bus.emit("MEMORY_WRITTEN", res);
  });

}

registerCoreFlows();

module.exports = bus;
