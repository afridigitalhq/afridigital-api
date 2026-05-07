const { render } = require("./v8-ui-engine.cjs");
const https = require("https");

const FRONTEND_SERVICE = "srv-d7st7sugkk3c73dl004g";
const BACKEND_SERVICE  = "srv-d7stmedckfvc73cp73i0";

const LIVE_FRONTEND = "https://afridigital-hub.onrender.com";
const LIVE_BACKEND  = "https://afridigital-api.onrender.com";

function fetch(url) {
  return new Promise(resolve => {
    https.get(url, res => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve(data));
    }).on("error", () => resolve(null));
  });
}

function detect(html) {
  return {
    hero: html?.includes("hero"),
    auth: html?.includes("auth"),
    services: html?.includes("services"),
  };
}

function decide(frontend, backend) {
  const issues = [];

  if (!frontend.hero) issues.push("FRONTEND_HERO_FAIL");
  if (!frontend.auth) issues.push("FRONTEND_AUTH_FAIL");
  if (!backend) issues.push("BACKEND_DOWN");

  return issues;
}

(async () => {
  console.log("🚀 AFRIDIGITAL V8 ORCHESTRATOR STARTED");

  const frontendHTML = await fetch(LIVE_FRONTEND);
  const backendPing  = await fetch(LIVE_BACKEND);

  const frontendState = detect(frontendHTML);
  const backendState  = !!backendPing;

  const issues = decide(frontendState, backendState);

  console.log("Frontend State:", frontendState);
  console.log("Backend Alive:", backendState);
  console.log("Issues:", issues);

  if (issues.length === 0) {
    console.log("\n✅ SYSTEM HEALTHY — NO ACTION REQUIRED");
  } else {
    console.log("\n⚠️ SYSTEM DEGRADATION DETECTED");

    const critical = issues.includes("BACKEND_DOWN");

    if (critical) {
      console.log("🔥 CRITICAL: Backend failure → trigger full redeploy flow");
    } else {
      console.log("🟡 UI DRIFT ONLY → frontend rebuild recommended");

      const { execSync } = require("child_process");
      execSync("npm run build", { stdio: "inherit" });

      console.log("📦 Frontend rebuild complete");
    }
  }

  console.log("\n🔒 AFRIDIGITAL V8 COMPLETE (SERVICE-AWARE MODE)");
})();

try { render(); } catch(e) {}
