const https = require("https");

const services = {
  frontend: "https://afridigital-hub.onrender.com",
  backend: "https://afridigital-api.onrender.com"
};

let logs = [];

function log(event) {
  const entry = {
    time: new Date().toISOString(),
    message: event
  };

  logs.push(entry);
  if (logs.length > 200) logs.shift();

  console.log(event);
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

async function checkService(name, url) {
  const ok = await ping(url);

  if (ok) {
    log(`🟢 [V44] ${name.toUpperCase()} ONLINE`);
    return "healthy";
  }

  log(`🔴 [V44] ${name.toUpperCase()} DOWN`);
  return "down";
}

async function recovery(name, url) {
  log(`🔁 [V44] Recovery triggered for ${name}`);

  await new Promise(r => setTimeout(r, 2000));

  const ok = await ping(url);

  if (ok) {
    log(`🟡 [V44] ${name.toUpperCase()} RESTORED`);
    return;
  }

  log(`❌ [V44] ${name.toUpperCase()} STILL DOWN`);
}

async function cycle() {
  log("🚀 [V44] SYSTEM CYCLE START");

  for (const [name, url] of Object.entries(services)) {
    const status = await checkService(name, url);

    if (status === "down") {
      await recovery(name, url);
    }
  }

  log("🧠 [V44] CYCLE COMPLETE\n");
}

setInterval(cycle, 5000);
cycle();

// Expose logs (for dashboard / WhatsApp AI later)
module.exports = { logs };
