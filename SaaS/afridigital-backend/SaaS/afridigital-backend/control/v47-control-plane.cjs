const https = require("https");

const services = {
  frontend: "https://afridigital-hub.onrender.com",
  backend: "https://afridigital-api.onrender.com"
};

let logs = [];

function log(msg) {
  const entry = `[V47] ${msg}`;
  logs.push(entry);
  if (logs.length > 200) logs.shift();
  console.log(entry);
}

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

async function health(name, url) {
  const ok = await ping(url);

  if (ok) {
    log(`${name.toUpperCase()} → 🟢 ONLINE`);
    return true;
  } else {
    log(`${name.toUpperCase()} → 🔴 DOWN`);
    return false;
  }
}

async function recover(name, url) {
  log(`RECOVERY INITIATED: ${name}`);

  await new Promise(r => setTimeout(r, 2500));

  const ok = await ping(url);

  if (ok) {
    log(`${name.toUpperCase()} RECOVERED 🟡`);
  } else {
    log(`${name.toUpperCase()} STILL DOWN ❌`);
  }
}

/**
 * 🧠 CONTROL ENGINE (NEW IN V47)
 */
async function execute(command) {
  log(`COMMAND RECEIVED: ${command}`);

  switch (command) {
    case "status":
      for (const [name, url] of Object.entries(services)) {
        await health(name, url);
      }
      break;

    case "recover backend":
      await recover("backend", services.backend);
      break;

    case "recover frontend":
      await recover("frontend", services.frontend);
      break;

    case "cycle":
      await cycle();
      break;

    default:
      log("UNKNOWN COMMAND");
  }
}

async function cycle() {
  log("SYSTEM CYCLE START");

  for (const [name, url] of Object.entries(services)) {
    const ok = await health(name, url);

    if (!ok) {
      await recover(name, url);
    }
  }

  log("SYSTEM CYCLE COMPLETE");
}

/**
 * 📡 EXPOSE CONTROL API (SIMULATED CORE)
 */
function getStatus() {
  return {
    services: Object.keys(services),
    logs: logs.slice(-20)
  };
}

module.exports = {
  execute,
  cycle,
  getStatus,
  logs
};

// AUTO START
setInterval(cycle, 8000);
cycle();
