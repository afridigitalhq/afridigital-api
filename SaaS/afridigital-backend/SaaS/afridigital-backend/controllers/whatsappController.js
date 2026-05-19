const { assertApiVersion } = require("../runtime/safety/api.guard");
const { generateAIReply } = require('../../core/ai/v8.7.ai.bridge');
const dispatcher=require('../modules/dispatcher');
const brain=require('../modules/brain');
const sendWhatsApp = require("../services/whatsapp.unified");
const { handleIncomingMessage } = require("../modules/chat");

exports.verify = (req, res) => {
  const VERIFY_TOKEN =
    process.env.WHATSAPP_VERIFY_TOKEN || "afridigital_verify";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WhatsApp Webhook Verified");
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
};
exports.receive = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
console.log("🔥 WHATSAPP WEBHOOK HIT");
    const message = value?.messages?.[0];
    if (!message) {
      return res.sendStatus(200);
    }
    const from = message.from;
    const text = message.text?.body || "";
    console.log("WhatsApp:", from, text);
    const aiResponse = await handleIncomingMessage({ trace: true,
      message: text,
      channel: "whatsapp",
      from
    });
    console.log("AI Response:", aiResponse);
    await sendWhatsApp(from, aiResponse || "Processed.");
    return res.sendStatus(200);
  } catch (err) {
    console.error("WhatsApp Error:", err);
    return res.sendStatus(500);
  }

  if (text === "unfreeze withdrawals") {
    FinanceControl.unfreezeWithdrawals();
    return "🔥 Withdrawals RESTORED";
  }

  if (text === "withdrawal status") {
    return `📊 Status: ${FinanceControl.getStatus()}`;
  }

  return null;
}

module.exports.handleAdminFinanceCommands = handleAdminFinanceCommands;

// 🚨 FRAUD ALERT HOOK
function sendFraudAlert(tx, fraud) {

  const message =
`🚨 FRAUD ALERT DETECTED
User: ${tx.userId}
Amount: ${tx.amount}
Risk Score: ${fraud.riskScore}
Status: ${fraud.flagged ? "FLAGGED" : "MONITORED"}
TxID: ${tx.id}`;

  // plug into your WhatsApp sender if available
  console.log("📲 ADMIN ALERT:", message);

  return message;
}

module.exports.sendFraudAlert = sendFraudAlert;


// 🚨 AUTO-FREEZE ALERT EXTENSION
function sendFreezeAlert(tx, fraud, freezeStatus) {

  if (freezeStatus !== "AUTO_FROZEN") return;

  const message =
`🧊 SYSTEM AUTO-FREEZE ACTIVATED

User: ${tx.userId}
Amount: ${tx.amount}
Risk Score: ${fraud.riskScore}
Action: ${freezeStatus}
TxID: ${tx.id}

⚠️ Manual review required`;

  console.log("📲 ADMIN FREEZE ALERT:", message);

  return message;
}

module.exports.sendFreezeAlert = sendFreezeAlert;

