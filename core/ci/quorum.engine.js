function evaluateQuorum(pr, admins) {
  const approvals = pr.approvals || 0;

  if (admins.length >= 2) {
    return approvals >= 2;
  }

  if (admins.length === 1) {
    return approvals >= 1;
  }

  return false; // HOLD state
}

module.exports = { evaluateQuorum };
