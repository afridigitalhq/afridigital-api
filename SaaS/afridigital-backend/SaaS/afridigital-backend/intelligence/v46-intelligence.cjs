const https = require("https");

const services = {
  frontend: "https://afridigital-hub.onrender.com",
  backend: "https://afridigital-api.onrender.com"
};

let state = {
  backendFailures: 0
};

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

function classify(result) {
  if (!result.ok && result.code === "TIMEOUT") return "🟥 HARD DOWN";
  if (!result.ok) return "🟧 ERROR STATE";
  if (result.code >= 200 && result.code < 500) return "🟢 HEALTHY";
  return "🟨 UNKNOWN";
}

async function check(name, url) {
  const res = await ping(url);
  const status = classify(res);

  console.log(`\n🧠 ${name.toUpperCase()} STATUS: ${status}`);
  console.log(`📡 RESPONSE CODE: ${res.code}`);

  return { status, res };
}

async function recover(name, url, result) {
  state.backendFailures++;

  console.log(`\n🔁 RECOVERY ATTEMPT ${state.backendFailures} FOR ${name}`);

  if (state.backendFailures >= 3) {
    console.log("🚨 ESCALATION: SYSTEM STABILITY DEGRADED");
    console.log("⏳ BACKOFF MODE ACTIVATED (10s)\n");

    await new Promise(r => setTimeout(r, 10000));
    state.backendFailures = 0;
    return;
  }

  await new Promise(r => setTimeout(r, 3000));

  const retry = await ping(url);

  if (retry.ok) {
    console.log(`🟡 ${name.toUpperCase()} RECOVERED`);
    state.backendFailures = 0;
  } else {
    console.log(`❌ ${name.toUpperCase()} STILL UNAVAILABLE`);
  }
}

async function cycle() {
  console.log("\n🚀 [V46 INTELLIGENCE CYCLE START]\n");

  for (const [name, url] of Object.entries(services)) {
    const result = await check(name, url);

    if (result.status !== "🟢 HEALTHY") {
      await recover(name, url, result);
    }
  }

  console.log("\n🧠 [V46 CYCLE COMPLETE]\n");
}

setInterval(cycle, 7000);
cycle();
