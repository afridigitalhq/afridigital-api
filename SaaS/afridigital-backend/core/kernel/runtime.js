const dag = require("./dag/engine");

function getDomain(file) {
  if (!file) return "system";

  if (file.includes("/whatsapp")) return "whatsapp";
  if (file.includes("/africore")) return "africore";
  if (file.includes("/agents")) return "agents";
  if (file.includes("/integrations")) return "integrations";

  return "system";
}

function classifyRequest(request) {
  const valid = ["whatsapp","africore","agents","integrations"];
  if (!request) return "system";
  if (valid.includes(request)) return request;
  return "system";
}

/**
 * BUILD EXECUTION PLAN ONLY
 */
function buildPlan(fromFile, request) {
  const from = getDomain(fromFile);
  const to = classifyRequest(request);

  const plan = dag.planExecution(from, to);

  return {
    from,
    to,
    plan
  };
}

module.exports = {
  buildPlan
};
