const tools = require('../../tools/index');
const memory = require('../../memory/simpleMemory');

module.exports = async function afriBrainV2(input) {
  try {
    const { from, message } = input;

    // MEMORY LOAD
    const history = memory.get(from) || [];

    // SIMPLE CONTEXT BUILD
    const context = {
      message,
      history
    };

    let actions = [];

    // BASIC INTENT ENGINE (upgrade point for AI later)
    let reply = "";

    if (!message) {
      return { ok: false, error: "EMPTY_MESSAGE" };
    }

    if (message.toLowerCase().includes("hi")) {
      reply = "Hello 👋 AfriBrain V2 online";
    } else if (message.toLowerCase().includes("time")) {
      reply = "I can process time requests in V2 mode.";
    } else {
      reply = "Processing your request via AfriBrain V2...";
    }

    // TOOL CALL EXAMPLE
    actions.push({
      tool: "sendWhatsApp",
      args: { to: from, message: reply }
    });

    // MEMORY SAVE
    memory.push(from, { message, reply });

    return {
      ok: true,
      reply,
      actions
    };

  } catch (e) {
    return {
      ok: false,
      error: e.message
    };
  }
};
