const https = require('https');
const collect = require('./truth/collector');
const scoreFn = require('./utils/score');

const ENDPOINT = "https://afridigital-api.onrender.com/health";

function fetchHealth(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ status: "UNPARSEABLE" }); }
      });
    }).on("error", () => resolve({ status: "DOWN" }));
  });
}

async function runControlPlane() {
  const local = collect();
  const remote = await fetchHealth(ENDPOINT);

  const score = scoreFn(local)?.score || 0;

  return {
    score,
    state: score < 60 ? "DEGRADED" : "STABLE",
    uptime: local.core.uptime,
    infra: local.infra,
    db: local.databases,
    meta: local.meta,

    render: {
      endpoint: ENDPOINT,
      status: remote.status || "UNKNOWN",
      raw: remote
    },

    telemetry: local.telemetry
  };
}

module.exports = runControlPlane;
