const STATES = {
  CREATED: "CREATED",
  QUEUED: "QUEUED",
  UNDER_REVIEW: "UNDER_REVIEW",
  RISK_SCANNED: "RISK_SCANNED",
  APPROVED: "APPROVED",
  CANARY: "CANARY",
  PRODUCTION: "PRODUCTION",
  ROLLED_BACK: "ROLLED_BACK",
  REJECTED: "REJECTED"
};

function transition(pr, nextState) {
  pr.state = nextState;
  pr.updatedAt = Date.now();
  return pr;
}

module.exports = { STATES, transition };
