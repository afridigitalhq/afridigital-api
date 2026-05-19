const https = require("https");

const services = {
  frontend: "https://afridigital-hub.onrender.com",
  backend: "https://afridigital-api.onrender.com"
};

function ping(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });

    req.on("error", () => resolve(false));

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function checkAll() {
  console.clear();
  console.log("🚀 V43 DISTRIBUTED ORCHESTRATOR\n");

  for (const [name, url] of Object.entries(services)) {
    const ok = await ping(url);
    console.log(
      `🧩 ${name.toUpperCase()} → ${ok ? "🟢 ONLINE" : "🔴 OFFLINE"}`
    );
  }

  console.log("\n🧠 SYSTEM HEALTH SCAN COMPLETE");
}

setInterval(checkAll, 5000);
checkAll();
