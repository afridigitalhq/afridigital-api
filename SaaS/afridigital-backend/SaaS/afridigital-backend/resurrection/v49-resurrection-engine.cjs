const https = require("https");

const services = {
  frontend: "https://afridigital-hub.onrender.com",
  backend: "https://afridigital-api.onrender.com"
};

let state = {
  backendAttempts: 0,
  history: []
};

function log(msg) {
  const entry = `[V49] ${msg}`;
  state.history.push(entry);
  if (state.history.length > 200) state.history.shift();
  console.log(entry);
}

function ping(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({ ok: true, code: res.statusCode });
    });

    req.on("error", () => resolve({ ok: false, code: "ERR" }));

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ ok: false, code: "TIMEOUT" });
    });
  });
}

async function check(name, url) {
  const res = await ping(url);

  if (res.ok) {
    log(`${name.toUpperCase()} → 🟢 ONLINE`);
    return true;
  }

  log(`${name.toUpperCase()} → 🔴 DOWN (${res.code})`);
  return false;
}

/**
 * 🔁 RESURRECTION ENGINE (V49 CORE)
 */
async function resurrect(service) {
  state.backendAttempts++;

  log(`RESURRECTION ATTEMPT #${state.backendAttempts} FOR ${service}`);

  // Step 1: cooldown
  await new Promise(r => setTimeout(r, 3000));

  const res = await ping(services[service]);

  if (res.ok) {
    log(`${service.toUpperCase()} RECOVERED 🟡`);
    state.backendAttempts = 0;
    return;
  }

  // Step 2: escalation logic
  if (state.backendAttempts >= 3) {
    log(`🚨 ESCALATION TRIGGERED: ${service}`);

    await new Promise(r => setTimeout(r, 5000));

    // 🧠 placeholder for real deployment hook (Render webhook later)
    log(`🌐 DEPLOYMENT RESURRECTION HOOK READY (NO EXECUTION YET)`);

    state.backendAttempts = 0;
    return;
  }

  log(`${service.toUpperCase()} STILL DOWN ❌`);
}

/**
 * 📊 SYSTEM CYCLE
 */
async function cycle() {
  log("SYSTEM CYCLE START");

  for (const [name, url] of Object.entries(services)) {
    const ok = await check(name, url);

    if (!ok) {
      await resurrect(name);
    }
  }

  log("SYSTEM CYCLE COMPLETE\n");
}

/**
 * 🧠 AI CONTROL LAYER
 */
async function execute(command) {
  log(`COMMAND: ${command}`);

  switch (command) {
    case "status":
      for (const [n, u] of Object.entries(services)) {
        await check(n, u);
      }
      break;

    case "recover backend":
      await resurrect("backend");
      break;

    case "resurrect backend":
      await resurrect("backend");
      break;

    case "cycle":
      await cycle();
      break;

    default:
      log("UNKNOWN COMMAND");
  }
}

module.exports = {
  execute,
  cycle,
  history: state.history
};

setInterval(cycle, 8000);
cycle();
