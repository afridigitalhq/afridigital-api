export class AfriA2AError extends Error {

  constructor(code, message, details = null) {
    super(message);
    this.name = "AfriA2AError";
    this.code = code;
    this.details = details;
  }

}

export const A2A_ERRORS = Object.freeze({
  AGENT_NOT_FOUND: "AGENT_NOT_FOUND",
  AGENT_REVOKED: "AGENT_REVOKED",
  CAPABILITY_NOT_FOUND: "CAPABILITY_NOT_FOUND",
  CAPABILITY_DISABLED: "CAPABILITY_DISABLED",
  CAPABILITY_FORBIDDEN: "CAPABILITY_FORBIDDEN",
  AUTHORIZATION_FORBIDDEN: "AUTHORIZATION_FORBIDDEN",
  INVALID_REQUEST: "INVALID_REQUEST",
  TASK_FAILED: "TASK_FAILED"
});
