const fs = require("fs");

let s = fs.readFileSync("server.js", "utf8");

if (!s.includes("attachRoutes")) {
  s = s.replace(
    "const getAttackTopology",
    "const getAttackTopology\nconst attachRoutes = require('./server.routes.clean')"
  );
}

if (!s.includes("attachRoutes(app")) {
  s = s.replace(
    "mountKernelObservability(app,kernel);",
    `mountKernelObservability(app,kernel);

attachRoutes(app, {
  getInbox,
  reviewPR,
  executeApprovedPR,
  getEvents,
  replay,
  getInsights,
  getState,
  getAttackTopology
});`
  );
}

fs.writeFileSync("server.js", s);
console.log("🟢 PATCH FILE APPLIED CLEANLY");
