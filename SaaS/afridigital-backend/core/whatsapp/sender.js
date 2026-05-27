async function sendWhatsAppMessage(to, message){
  console.log("📤 WHATSAPP:", { to, message });
}
module.exports = { sendWhatsAppMessage };
