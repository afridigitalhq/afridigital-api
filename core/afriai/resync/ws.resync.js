const fs = require("fs");

function resync() {
  const snapshotPath = "./snapshots/ws/ws.snapshot.json";

  const snapshot = JSON.parse(fs.readFileSync(snapshotPath,"utf8"));

  // SAFE normalization only (no logic mutation)
  const corrected = {
    ...snapshot,
    meta: {
      ...snapshot.meta,
      servicesMounted: snapshot.registry.length
    },
    kernelReport: {
      ...snapshot.kernelReport,
      registered: snapshot.registry.length
    }
  };

  fs.writeFileSync(snapshotPath, JSON.stringify(corrected,null,2));

  return {
    ok: true,
    message: "REGISTRY RESYNC COMPLETED (SAFE MODE)",
    before: snapshot.meta.servicesMounted,
    after: corrected.meta.servicesMounted
  };
}

module.exports = { resync };
