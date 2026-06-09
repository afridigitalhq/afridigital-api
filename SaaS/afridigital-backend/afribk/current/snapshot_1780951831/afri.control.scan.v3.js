const http = require('http');
const https = require('https');

function request(url, method = "GET", data = null) {
  const lib = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    const start = Date.now();

    const req = lib.request(url, { method }, (res) => {
      let body = '';

      res.on('data', c => body += c);

      res.on('end', () => {
        resolve({
          ok: true,
          status: res.statusCode,
          latency: Date.now() - start,
          body
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        ok: false,
        error: err.message,
        latency: Date.now() - start
      });
    });

    if (data) req.write(data);

    req.end();
  });
}

(async () => {

  console.log("🧠 AFRI CONTROL MODE v3 START");

  // -----------------------------
  // 1. LOCAL HEALTH CHECK
  // -----------------------------
  const local = await request('http://localhost:3000/health');

  // -----------------------------
  // 2. RENDER HEALTH CHECK
  // -----------------------------
  const render = await request('https://afridigital-api.onrender.com/health');

  // -----------------------------
  // 3. WEBHOOK SIMULATION (SAFE GET)
  // -----------------------------
  const webhook = await request('https://afridigital-api.onrender.com/webhook');

  // -----------------------------
  // 4. API CONTRACT CHECK
  // -----------------------------
  const apiTest = await request('https://afridigital-api.onrender.com/api/test');

  // -----------------------------
  // RESULT ENGINE
  // -----------------------------
  const result = {
    local: {
      ok: local.ok,
      latency: local.latency
    },
    render: {
      ok: render.ok,
      latency: render.latency
    },
    webhook: {
      reachable: webhook.ok,
      status: webhook.status || null
    },
    api: {
      testReachable: apiTest.ok,
      status: apiTest.status || null
    },
    analysis: {
      renderColdStart: render.latency > 1500,
      parity: local.ok && render.ok,
      status:
        (local.ok && render.ok)
          ? "V3_DEPLOY_READY"
          : "V3_DEGRADED"
    }
  };

  console.log("🧪 CONTROL V3 SNAPSHOT:");
  console.log(JSON.stringify(result, null, 2));

})();
