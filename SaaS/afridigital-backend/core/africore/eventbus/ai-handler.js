const bus = require("./bus");
const brain = require("../ai/brain");
const memory = require("../memory/db");
const tools = require("../tools/init");

bus.subscribe("whatsapp.inbound", async (event) => {

  const userId = event.from;

  const mem = memory.get(userId);

  const ai = await brain.think({
    text: event.text,
    user: userId,
    memory: mem
  });

  memory.append(userId, { text: event.text, role: "user" });
  memory.setIntent(userId, ai.category);

  await tools.run("send_message", {
    to: userId,
    text: ai.response
  });

});

module.exports = bus;
