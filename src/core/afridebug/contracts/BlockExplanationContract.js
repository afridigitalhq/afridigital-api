export const REQUIRED_FIELDS = [
  "status",
  "reasonCode",
  "technicalReason",
  "userExplanation",
  "evidenceReference",
  "requiredAction",
  "blockingGate",
  "afrifixAllowed"
];

export function validateBlockedResponse(response = {}) {
  const errors = REQUIRED_FIELDS.filter(
    (key) =>
      response[key] === undefined ||
      response[key] === null ||
      response[key] === ""
  );

  if (response.status !== "BLOCKED") {
    errors.push("status_must_be_BLOCKED");
  }

  if (response.afrifixAllowed !== false) {
    errors.push("afrifixAllowed_must_be_false");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function createBlockedResponse(input = {}) {
  const response = {
    status: "BLOCKED",
    reasonCode: input.reasonCode || "UNKNOWN_BLOCK",
    technicalReason:
      input.technicalReason ||
      "A required system gate prevented execution.",
    userExplanation:
      input.userExplanation ||
      "This job cannot continue safely until the blocking condition is resolved.",
    evidenceReference: input.evidenceReference || null,
    requiredAction:
      input.requiredAction ||
      "Review the blocking evidence and satisfy the required gate.",
    blockingGate: input.blockingGate || "UNKNOWN_GATE",
    afrifixAllowed: false
  };

  const validation = validateBlockedResponse(response);

  if (!validation.valid) {
    return {
      ...response,
      validationErrors: validation.errors
    };
  }

  return response;
}

export default {
  REQUIRED_FIELDS,
  createBlockedResponse,
  validateBlockedResponse
};
