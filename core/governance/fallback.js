function resolveApproval(quorumCount, required = 2) {
  if (quorumCount >= required) {
    return { status: "APPROVED" };
  }

  return {
    status: "DEFERRED_APPROVAL",
    reason: "Insufficient admins available"
  };
}

module.exports = { resolveApproval };
