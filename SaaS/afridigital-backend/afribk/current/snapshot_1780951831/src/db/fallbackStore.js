const memory = {
  messages: [],
  audits: []
};

function saveMessage(msg) {
  memory.messages.push(msg);
  return msg;
}

function saveAudit(audit) {
  memory.audits.push(audit);
  return audit;
}

function getStats() {
  return {
    messages: memory.messages.length,
    audits: memory.audits.length,
    mode: "FALLBACK_MEMORY"
  };
}

module.exports = { saveMessage, saveAudit, getStats };
