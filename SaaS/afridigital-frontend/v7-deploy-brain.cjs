const fs = require("fs");
const https = require("https");

const LIVE_URL = "https://afridigital-hub.onrender.com";
const DIST_FILE = "./dist/index.html";

function fetch(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve(data));
    }).on("error", () => resolve(null));
  });
}

function analyze(html) {
  const issues = [];

  if (!html.includes("hero")) issues.push("MISSING_HERO");
  if (!html.includes("auth")) issues.push("MISSING_AUTH");
  if (!html.includes("services")) issues.push("MISSING_SERVICES");

  return issues;
}

function shouldRedeploy(issues) {
  const critical = ["MISSING_HERO"];
  return issues.some(i => critical.includes(i));
}

(async () => {
  console.log("🚀 AFRIDIGITAL V7 DEPLOY BRAIN STARTED");

  const local = fs.readFileSync(DIST_FILE, "utf-8");
  const live = await fetch(LIVE_URL);

  const localIssues = analyze(local);
  const liveIssues = live ? analyze(live) : ["LIVE_UNREACHABLE"];

  console.log("LOCAL ISSUES:", localIssues);
  console.log("LIVE ISSUES:", liveIssues);

  const drift = localIssues.length !== liveIssues.length;

  if (drift) {
    console.log("\n⚠️ DRIFT DETECTED");

    if (shouldRedeploy(localIssues)) {
      console.log("🔥 CRITICAL FAILURE → TRIGGERING REBUILD");

      const { execSync } = require("child_process");
      execSync("npm run build", { stdio: "inherit" });

      console.log("📦 REBUILD COMPLETE");
      console.log("🚀 (Render deploy expected via push/hook)");
    } else {
      console.log("🟡 NON-CRITICAL DRIFT → NO DEPLOY");
    }
  } else {
    console.log("\n✅ SYSTEM STABLE — NO ACTION REQUIRED");
  }

  console.log("\n🔒 AFRIDIGITAL V7 COMPLETE");
})();
