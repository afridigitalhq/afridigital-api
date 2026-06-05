module.exports = function route(intent) {
  const map = {
    greet: "FLOW_GREET",
    system_status: "FLOW_STATUS",
    deploy_check: "FLOW_DEPLOY",
    unknown: "FLOW_FALLBACK"
  };

  return map[intent] || "FLOW_FALLBACK";
};
