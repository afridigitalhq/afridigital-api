let inbox = [];

function createPR(pr) {
  const obj = {
    id: "PR_" + Date.now(),
    state: "DRAFT",
    approvals: [],
    ...pr
  };

  inbox.push(obj);
  return obj;
}

function getPR(id) {
  return inbox.find(p => p.id === id);
}

function listPRs() {
  return inbox;
}

module.exports = { createPR, getPR, listPRs };
