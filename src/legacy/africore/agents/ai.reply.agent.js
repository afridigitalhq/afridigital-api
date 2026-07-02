module.exports = {
  name: "ai.reply.agent",

  async run(msg, bus) {
    if (!msg.text) return;

    // lightweight rule (later replace with AI engine)
    const reply = msg.text.includes("hello")
      ? "👋 AfriCore says hello"
      : `✔ processed: ${msg.text}`;

    bus.emit("agent.reply", {
      to: msg.from,
      message: reply
    });
  }
};
