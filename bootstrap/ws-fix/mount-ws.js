const { createWSGateway } = require("../ws-v2/output/ws-gateway");

function mountWS(server, kernel) {
  if (!server || !kernel) {
    console.log("❌ WS mount skipped (missing server/kernel)");
    return;
  }

  createWSGateway(server, kernel);

  console.log("🟢 WS V2 MOUNTED → /ws");
}

module.exports = { mountWS };
