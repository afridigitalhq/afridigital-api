module.exports = function planner(intent) {
  const map = {
    greeting: "flow.greeting",
    system_query: "flow.system",
    flow_request: "flow.runtime",
    unknown: "flow.fallback"
  };

  return map[intent.primary] || "flow.fallback";
};
