let inbox = [];

function createThread(pr) {
  const thread = {
    id: "pr-" + Date.now(),
    status: "OPEN",
    messages: [pr],
    approvals: 0,
    rejections: 0
  };

  inbox.push(thread);
  return thread;
}

function addComment(prId, message) {
  const thread = inbox.find(t => t.id === prId);
  if (!thread) return null;

  thread.messages.push(message);
  return thread;
}

function getInbox() {
  return inbox;
}

module.exports = { createThread, addComment, getInbox };
