const bus = require("./bus");
const tools = require("../tools/init");

bus.subscribe("whatsapp.message", async (event) => {
  await tools.run("send_message", {
    to: event.from,
    text: event.text
  });
});

module.exports = bus;
