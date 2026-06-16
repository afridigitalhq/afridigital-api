const https = require("https");

function ping(url) {
  return new Promise((resolve) => {
    const start = Date.now();

    const req = https.get(url, (res) => {
      res.on("data", () => {});
      res.on("end", () => {
        resolve({
          ok: true,
          latency: Date.now() - start,
          status: res.statusCode
        });
      });
    });

    req.on("error", () => {
      resolve({
        ok: false,
        latency: null,
        status: 0
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        ok: false,
        latency: null,
        status: 0
      });
    });
  });
}

async function collectLiveInfra(primaryUrl) {
  const result = await ping(primaryUrl);

  return {
    latency: result.latency || 0,
    availability: result.ok ? 100 : 0,
    status: result.ok ? "ONLINE" : "OFFLINE"
  };
}

module.exports = { collectLiveInfra };
