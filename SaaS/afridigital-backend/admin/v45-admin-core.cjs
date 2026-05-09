const https = require("https");

const services = {
  frontend: "https://afridigital-hub.onrender.com",
  backend: "https://afridigital-api.onrender.com"
};

let logs = [];

function log(msg) {
  const entry = {
    time: new Date().toISOString(),
    msg
  };

  logs.push(entry);
  if (logs.length > 200) logs.shift();

  console.log(msg);
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

async function check(name, url) {
  const ok = await ping(url);

  if (ok) {
    log(`🟢 [V45] ${name.toUpperCase()} HEALTHY`);
    return true;
  }

  log(`🔴 [V45] ${name.toUpperCase()} DOWN`);
  return false;
}

async function recover(name, url) {
  log(`🔁 [V45] RECOVERY INITIATED: ${name}`);

  await new Promise(r => setTimeout(r, 3000));

  const ok = await ping(url);

  if (ok) {
    log(`🟡 [V45] ${name.toUpperCase()} RESTORED`);
  } else {
    log(`❌ [V45] ${name.toUpperCase()} STILL FAILED`);
  }
}

async function cycle() {
  log("\n🚀 [V45] ADMIN SYSTEM CYCLE START");

  for (const [name, url] of Object.entries(services)) {
    const ok = await check(name, url);

    if (!ok) {
      await recover(name, url);
    }
  }

  log("🧠 [V45] CYCLE COMPLETE\n");
}

/**
 * 📡 ADMIN INTERFACE (SIMPLIFIED FOR NOW)
 */
function getStatus() {
  return {
    frontend: "tracked via cycle",
    backend: "tracked via cycle",
    logs: logs.slice(-10)
  };
}

module.exports = {
  cycle,
  getStatus,
  logs
};

setInterval(cycle, 6000);
cycle();
