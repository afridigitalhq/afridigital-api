/**
 * POLICY ENGINE v1
 * Controls what tools are allowed to execute
 */

const ALLOWED_TOOLS = new Set([
  "echoTool",
  "pricingTool",
  "supportTool"
]);

function validateToolAccess(userId, toolName, args) {
  // 1. Tool must exist in allowlist
  if (!ALLOWED_TOOLS.has(toolName)) {
    return {
      ok: false,
      reason: `Tool blocked: ${toolName}`
    };
  }

  // 2. Basic argument safety checks
  if (args && typeof args !== "object") {
    return {
      ok: false,
      reason: "Invalid arguments format"
    };
  }

  // 3. Example rule: block empty tool abuse
  if (toolName === "echoTool" && !args?.text) {
    return {
      ok: false,
      reason: "Missing text input"
    };
  }

  return {
    ok: true
  };
}

module.exports = {
  validateToolAccess
};
