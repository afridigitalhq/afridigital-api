function sendReply(msg, routed) {

  console.log("📩 WHATSAPP RESPONSE");
  console.log("To:", msg.from);
  console.log("Lane:", routed.lane);
  console.log("Reply:", "Processed via " + routed.lane + " engine");

  return {
    ok: true,
    to: msg.from,
    reply: "Processed via " + routed.lane + " lane"
  };
}

module.exports = { sendReply };
