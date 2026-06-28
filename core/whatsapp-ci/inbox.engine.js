const inbox = [];

function createPR(message, user) {
  const pr = {
    id: Date.now().toString(),
    message,
    user,
    status: "PENDING_REVIEW"
  };
  inbox.push(pr);
  return pr;
}

function listPRs() {
  return inbox;
}

module.exports = { createPR, listPRs };
