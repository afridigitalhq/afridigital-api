const pipeline = require("./pipeline");
const { execSync } = require("child_process");

function parseTimeFromPath(p) {
  const match = p.match(/(\d{10,})/g);
  if (!match) return { time: "unknown", raw: null };

  const ts = match[match.length - 1];
  const date = new Date(Number(ts) * 1000);

  return {
    time: date.toISOString(),
    raw: ts
  };
}

function getSnapshots() {
  try {
    const raw = execSync(
      "cd ~/AfriDigitalHub && find . -type d \\( -iname '*backup*' -o -iname '*snapshot*' -o -iname '*archive*' \\) 2>/dev/null",
      { encoding: "utf8" }
    );

    return raw
      .split("\n")
      .filter(Boolean)
      .map(p => {
        const t = parseTimeFromPath(p);

        return {
          name: p.split("/").pop(),
          path: p,
          type: p.includes("snapshot")
            ? "SNAPSHOT"
            : p.includes("archive")
            ? "ARCHIVE"
            : "BACKUP",
          timestamp: t.time,
          rawTime: t.raw
        };
      })
      .sort((a, b) => (a.rawTime || 0) - (b.rawTime || 0));
  } catch {
    return [];
  }
}

function groupByType(list) {
  return {
    backups: list.filter(x => x.type === "BACKUP"),
    snapshots: list.filter(x => x.type === "SNAPSHOT"),
    archives: list.filter(x => x.type === "ARCHIVE")
  };
}

function observatory() {
  const base = collector();
  const snaps = getSnapshots();
  const grouped = groupByType(snaps);

  const latest = snaps[snaps.length - 1] || null;

  return {
    version: "v3.7-OBSERVATORY",

    core: {
      score: base.score,
      state: base.state,
      uptime: base.uptime
    },

    infrastructure: base.infra,

    databases: base.db,

    meta: base.meta,

    telemetry: base.telemetry,

    snapshots: {
      total: snaps.length,
      latest: latest?.name || "NONE",
      latestTime: latest?.timestamp || "UNKNOWN",

      breakdown: {
        backups: grouped.backups.length,
        snapshots: grouped.snapshots.length,
        archives: grouped.archives.length
      },

      last3: snaps.slice(-3).reverse()
    }
  };
}

module.exports = observatory;
