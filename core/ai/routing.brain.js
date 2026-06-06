let safeRoutingLoaded=true;
const { buildProfile, personalizeRoute } = require('./personalization/brain');
const { getUser } = require('../../core/memory/memory.store.js');
module.exports = function route(intent) {
  const map = {
    services: "/economy/services",
    jobs: "/economy/jobs",
    tasks: "/economy/tasks",
    social: "/social",
    boost: "/economy/boost"
  };

  return map[intent] || "/chat";
};
