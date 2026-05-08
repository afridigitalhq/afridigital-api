const dispatcher=require('../modules/dispatcher');
const brain=require('../modules/brain');
let memory = require('../modules/memory');
let memory = require('../memory');
const { aiRouter } = require("../ai-engine/router");
const { memoryRecallPipeline } = (() => ({ reply: async () => "memory-disabled" }))();
const wallet = require("../../services/wallet/africoinWallet");
const escrow = require("../../services/escrow/escrowEngine");

async function handleIncomingMessage({ message, channel, from }) {
  console.log("📩 Incoming:", { from, message });

  try {
    // 🧠 MEMORY LAYER
    let memory = await memoryRecallPipeline({
      userId: from,
      message
    });

    // 🤖 AI ENGINE
    const ai = await aiRouter({
      message,
      memory,
      channel,
      userId: from
    });

    let economyAction = null;

    // 💰 INTERNAL ECONOMY (ACOIN)
    if (ai?.intent === "BOOST_AD") {
      const cost = ai.cost || 10;

      wallet.debit(from, cost);

      economyAction = {
        type: "AcoinDebit",
        amount: cost
      };

      console.log("💰 Acoin deducted:", cost);
    }

    // 📦 ESCROW TASK SYSTEM
    if (ai?.intent === "EARN_TASK") {
      escrow.lock(from, ai.taskId, ai.reward || 0);
      console.log("📦 Task locked:", ai.taskId);
    }

    if (ai?.intent === "COMPLETE_TASK") {
      escrow.release(ai.taskId);
      console.log("📦 Task released:", ai.taskId);
    }

    // 💬 RESPONSE
    const response =
      ai?.reply ||
      `🤖 AfriDigital AI: ${message}`;

    console.log("💬 AI Response:", response);

    return response;

  } catch (err) {
    console.error("❌ AI ENGINE ERROR:", err);
    return "⚠️ System temporarily unavailable.";
  }
}

module.exports = {
  handleIncomingMessage
};
