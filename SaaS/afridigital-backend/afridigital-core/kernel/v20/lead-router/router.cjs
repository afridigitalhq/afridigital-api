const { routeToAdmin } = require("../admin-routing/admin.router.cjs");

function handleLead(userRequest) {

  if (userRequest.includes("build app") || userRequest.includes("website")) {
    return routeToAdmin({
      type: "HIGH_VALUE_LEAD",
      request: userRequest
    });
  }

  return { status: "normal_flow" };
}

module.exports = { handleLead };
