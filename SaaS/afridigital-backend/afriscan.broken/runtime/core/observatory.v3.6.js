const pipeline = require("./pipeline");

function getBackups() {
  const { execSync } = require("child_process");
  try {
    const raw = execSync(
      "cd ~/AfriDigitalHub && find . -type d \\( -iname '*backup*' -o -iname '*snapshot*' -o -iname '*archive*' \\) 2>/dev/null",
      { encoding: "utf8" }
    );

    return raw
      .split("\n")
      .filter(Boolean)
      .slice(-10)
      .map((p, i) => ({
        id: i + 1,
        path: p,
        name: p.split("/").pop(),
        type: p.includes("snapshot") ? "SNAPSHOT" : "BACKUP"
      }));
  } catch {
    return [];
  }
}

function observatory() {
  const base = collector();

  const backups = getBackups();
  const latest = backups[backups.length - 1] || null;

  return {
    ...base,

    version: "v3.6-OBS",

    meta: {
      ...(base.meta || {}),
      tokenStatus: "UNKNOWN",
      webhookStatus: "UNKNOWN",
      envHealth: "UNKNOWN"
    },

    databases: {
      ...(base.db || {}),
      redis: base.db?.redis || "UNKNOWN",
      dbHealthScore: 0
    },

    snapshots: {
      total: backups.length,
      latest: latest ? latest.name : null,
      latestPath: latest ? latest.path : null,
      list: backups
    },

    observatory: {
      mode: "FULL_OBSERVATORY",
      brainStatus: base.score >= 60 ? "ACTIVE" : "LIMITED",
      systemScore: base.score,
      systemState: base.state
    }
  };
}

module.exports = observatory;
