const prs = new Map();

function createPR({ whatsappId, message }) {
  const id = "pr_" + Date.now();

  const pr = {
    id,
    whatsappId,
    message,
    status: "OPEN",
    comments: [],
    approvals: 0,
    rejections: 0
  };

  prs.set(id, pr);
  return pr;
}

function addComment(prId, user, text) {
  const pr = prs.get(prId);
  if (!pr) throw new Error("PR_NOT_FOUND");

  pr.comments.push({ user, text, ts: Date.now() });
  return pr;
}

function reviewPR({ prId, reviewerId, action }) {
  const pr = prs.get(prId);
  if (!pr) throw new Error("PR_NOT_FOUND");

  pr.comments.push({
    user: reviewerId,
    text: action,
    ts: Date.now()
  });

  if (action === "APPROVE") pr.approvals++;
  if (action === "REJECT") pr.rejections++;

  return pr;
}

function executeApprovedPR(pr) {
  if (pr.approvals < 1) {
    throw new Error("NOT_APPROVED");
  }

  pr.status = "MERGED";
  return { deployed: true, prId: pr.id };
}

module.exports = {
  createPR,
  addComment,
  reviewPR,
  executeApprovedPR
};
