const STATES = [
  "DRAFT",
  "REVIEW",
  "QUORUM_PENDING",
  "APPROVED",
  "GATED",
  "EXECUTED",
  "VERIFIED"
];

function transition(current, next) {
  const i = STATES.indexOf(current);
  const j = STATES.indexOf(next);

  if (j !== i + 1) {
    throw new Error(`Invalid PR transition: ${current} → ${next}`);
  }

  return next;
}

module.exports = { STATES, transition };
