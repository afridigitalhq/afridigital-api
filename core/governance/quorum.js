let approvals = {};

function requestApproval(actionId, userId) {
  if (!approvals[actionId]) {
    approvals[actionId] = { yes: new Set(), no: new Set(), status: "PENDING" };
  }

  return approvals[actionId];
}

function vote(actionId, userId, decision) {
  const q = requestApproval(actionId, userId);

  q.yes.delete(userId);
  q.no.delete(userId);

  if (decision === "APPROVE") q.yes.add(userId);
  if (decision === "REJECT") q.no.add(userId);

  if (q.yes.size >= 2) q.status = "APPROVED";
  if (q.no.size >= 1) q.status = "REJECTED";

  return q;
}

function getStatus(actionId) {
  return approvals[actionId] || null;
}

module.exports = { requestApproval, vote, getStatus };
