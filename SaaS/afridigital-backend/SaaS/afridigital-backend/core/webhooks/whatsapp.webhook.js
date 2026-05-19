const { assertApiVersion } = require("../runtime/safety/api.guard");
exports.webhook = async (payload) => {
  try {

    console.log('🔥 WEBHOOK CORE START');

    if (!payload) {
      console.log('⚠️ EMPTY PAYLOAD');
      return;
    }

    const messages =
      payload.entry?.[0]?.changes?.[0]?.value?.messages || [];

    if (!messages.length) {
      console.log('⚠️ NO MESSAGES FOUND');
      return;
    }

    for (const msg of messages) {
      console.log('📩 MESSAGE FROM:', msg.from);
      console.log('💬 TEXT:', msg.text?.body);
    }

    console.log('✅ WEBHOOK CORE COMPLETE');

  } catch (err) {
    console.error('❌ WEBHOOK CORE ERROR:', err);
    throw err;
  }
};
