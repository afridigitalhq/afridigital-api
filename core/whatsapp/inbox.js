const inbox = [];

function createPRThread(pr) {
  const thread = {
    id: "pr-" + Date.now(),
    status: "OPEN",
    messages: [pr],
    approvals: 0
  };

  inbox.push(thread);
  return thread;
}

function addMessage(id, msg) {
  const t = inbox.find(x => x.id === id);
  if (!t) return null;

  t.messages.push(msg);
  return t;
}

function listInbox() {
  return inbox;
}

module.exports = { createPRThread, addMessage, listInbox };
