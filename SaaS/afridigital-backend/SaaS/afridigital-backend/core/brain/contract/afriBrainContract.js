module.exports = async function afriBrainContract(input) {
  try {
    const { from, message } = input;

    let reply = "";

    if (!message) {
      return { ok: false, error: "EMPTY_MESSAGE" };
    }

    if (message.toLowerCase().includes("hi")) {
      reply = "Hello 👋 I am AfriAI";
    } else {
      reply = "I didn't understand that.";
    }

    return {
      ok: true,
      reply,
      actions: [
        {
          type: "send_message",
          to: from,
          message: reply
        }
      ]
    };

  } catch (e) {
    return { ok: false, error: e.message };
  }
};
