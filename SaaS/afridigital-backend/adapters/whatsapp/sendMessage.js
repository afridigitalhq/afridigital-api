async function sendMessage(to, text) {
  console.log("📤 SEND MESSAGE:", { to, text });
  return { success: true };
}

module.exports = { sendMessage };
