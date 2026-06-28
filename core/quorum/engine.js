const approvals = new Map();

function requestApproval(prId, userId) {
  if (!approvals.has(prId)) approvals.set(prId, new Set());
  approvals.get(prId).add(userId);
  return approvals.get(prId).size;
}

function isApproved(prId) {
  const count = approvals.get(prId)?.size || 0;
  return count >= 2; // quorum rule
}

module.exports = { requestApproval, isApproved };
