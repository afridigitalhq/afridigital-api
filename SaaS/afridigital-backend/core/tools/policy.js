const ALLOWED_TOOLS = ["echo", "getTime"];

function isAllowed(toolName) {
  return ALLOWED_TOOLS?.includes(toolName);
}

module.exports = { isAllowed };
