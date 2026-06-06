const { getUser } = require('../../memory/memory.store');
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
