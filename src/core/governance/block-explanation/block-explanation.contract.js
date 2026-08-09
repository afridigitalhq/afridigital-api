const REQUIRED_FIELDS = Object.freeze([
  "status",
  "reasonCode",
  "technicalReason",
  "userExplanation",
  "evidenceReference",
  "requiredAction",
  "blockingGate",
  "afrifixAllowed"
]);

const BLOCKED_STATUS = "BLOCKED";

function createBlockedResponse(input = {}) {
  const response = {
    status: BLOCKED_STATUS,
    reasonCode: input.reasonCode || "UNKNOWN_BLOCK",
    technicalReason: input.technicalReason || "The system could not safely continue.",
    userExplanation: input.userExplanation || "This job is temporarily blocked because a required system condition has not been satisfied.",
    evidenceReference: input.evidenceReference || null,
    requiredAction: input.requiredAction || "Review the blocking condition and satisfy the required gate.",
    blockingGate: input.blockingGate || "UNKNOWN_GATE",
    afrifixAllowed: false
  };

  return Object.freeze(response);
}

function validateBlockedResponse(response) {
  const failures = REQUIRED_FIELDS
    .filter(field => response == null || response[field] === undefined);

  if (response?.status !== BLOCKED_STATUS) {
    failures.push("STATUS_MUST_BE_BLOCKED");
  }

  if (response?.afrifixAllowed !== false) {
    failures.push("AFRIFIX_MUST_REMAIN_BLOCKED");
  }

  return {
    valid: failures.length === 0,
    failures
  };
}

module.exports = Object.freeze({
  REQUIRED_FIELDS,
  BLOCKED_STATUS,
  createBlockedResponse,
  validateBlockedResponse
});
