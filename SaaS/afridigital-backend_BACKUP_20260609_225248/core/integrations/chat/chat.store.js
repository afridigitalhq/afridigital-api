/**
 * 📡 CHAT STORE (IN-MEMORY STREAM BUFFER)
 */

const messages = [];

function addMessage(msg) {
  messages.push({
    ...msg,
    ts: Date.now()
  });
}

function getMessages() {
  return messages.slice(-100);
}

module.exports = {
  addMessage,
  getMessages
};
