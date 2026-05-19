const https = require("https");

const ADMIN_KEY = process.env.ADMIN_KEY || "DEV_ADMIN_ONLY";

const services = {
  frontend: "https://afridigital-hub.onrender.com",
  backend: "https://afridigital-api.onrender.com"
};

let logs = [];

/**
 * 🔐 PERMISSION LAYER
 */
function isAdmin(key) {
  return key === ADMIN_KEY;
}

/**
 * 📡 LOGGING SYSTEM
 */
function log(msg) {
  const entry = `[V48] ${msg}`;
  logs.push(entry);
  if (logs.length > 200) logs.shift();
  console.log(entry);
}

/**
 * 🌐 HEALTH CHECK
 */
function ping(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });

    req.on("error", () => resolve(false));

    req.setTimeout(4000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * 🧠 RECOVERY ENGINE
 */
async function recover(service) {
  log(`RECOVERY ENGINE TRIGGERED: ${service}`);

  await new Promise(r => setTimeout(r, 2500));

  const ok = await ping(services[service]);

  if (ok) {
    log(`${service.toUpperCase()} RESTORED 🟡`);
  } else {
    log(`${service.toUpperCase()} STILL DOWN ❌`);
  }
}

/**
 * 📊 STATUS ENGINE
 */
async function status() {
  for (const [name, url] of Object.entries(services)) {
    const ok = await ping(url);
    log(`${name.toUpperCase()} → ${ok ? "🟢 ONLINE" : "🔴 DOWN"}`);
  }
}

/**
 * 🧠 AI COMMAND ROUTER
 */
async function executeCommand(command, key) {

  if (!isAdmin(key)) {
    return "❌ ACCESS DENIED: ADMIN ONLY";
  }

  log(`COMMAND RECEIVED: ${command}`);

  switch (command) {

    case "status":
      await status();
      break;

    case "recover backend":
      await recover("backend");
      break;

    case "recover frontend":
      await recover("frontend");
      break;

    case "logs":
      return logs.slice(-20);

    default:
      log("UNKNOWN COMMAND");
  }
}

/**
 * 🧠 AI EXPLANATION ENGINE
 */
function explain(query) {

  if (query.includes("recovery")) {
    return {
      file: "ai-control/v48-ai-brain.cjs",
      function: "recover(service)",
      description: "Handles backend/frontend failure recovery by re-checking service health and triggering retry logic."
    };
  }

  if (query.includes("status")) {
    return {
      file: "ai-control/v48-ai-brain.cjs",
      function: "status()",
      description: "Checks health of all registered services using HTTPS ping."
    };
  }

  return {
    message: "No matching system logic found."
  };
}

module.exports = {
  executeCommand,
  explain,
  logs
};
