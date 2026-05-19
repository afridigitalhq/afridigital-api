function routeToAdmin(payload) {

  console.log("\n🔐 ADMIN ROUTE TRIGGERED");

  return {
    routed: true,
    destination: "ADMIN_ONLY_DASHBOARD",
    payload
  };
}

module.exports = { routeToAdmin };
