function approve(pr, user) {
  if (user.role !== "ADMIN") return pr;

  if (!pr.approvals.includes(user.id)) {
    pr.approvals.push(user.id);
  }

  if (pr.approvals.length >= 2) {
    pr.state = "APPROVED";
  } else {
    pr.state = "QUORUM_PENDING";
  }

  return pr;
}

module.exports = { approve };
