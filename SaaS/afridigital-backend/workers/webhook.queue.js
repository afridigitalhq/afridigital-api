const { generateReply } = require('../core/ai/reply.engine');
const sendMessage = require('../core/whatsapp/sendMessage');

exports.push = async (payload) => {
  const messages =
    payload.entry?.[0]?.changes?.[0]?.value?.messages || [];

  for (const msg of messages) {
    const from = msg.from;
    const text = msg.text?.body || "";

    console.log("🧠 INPUT:", text);

    const reply = await generateReply(text, from);

    console.log("🤖 REPLY:", reply);

    await sendMessage(from, reply);
  }
};
