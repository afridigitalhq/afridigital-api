const http = require('http');
const https = require('https');

function check(url) {
  const lib = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    lib.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ ok: true, data }));
    }).on('error', (err) => resolve({ ok: false, error: err.message }));
  });
}

(async () => {

  console.log("🧠 AFRI CONTROL MODE v1 (FIXED)");

  const local = await check('http://localhost:3000/health');
  const render = await check('https://afridigital-api.onrender.com/health');

  const result = {
    local: local.ok,
    render: render.ok,
    localData: local.data || null,
    renderData: render.data || null,
    status: (local.ok && render.ok) ? "DEPLOY_READY" : "DEGRADED"
  };

  console.log("🧪 SYSTEM SNAPSHOT:");
  console.log(JSON.stringify(result, null, 2));

})();
