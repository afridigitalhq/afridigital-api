const fs = require("fs");
const path = require("path");

/* =========================
   SAFE FILE WALK (NO MUTATION)
========================= */
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full, out);
      else out.push(full);
    } catch {}
  }
  return out;
}

/* =========================
   SERVER FILTER (REAL RUNTIME ONLY)
========================= */
function detectServers(files) {
  return files.filter(f =>
    f.endsWith("server.js") &&
    !f.includes("_CLEAN_ARCHIVE") &&
    !f.includes("snapshot") &&
    !f.includes("backup") &&
    !f.includes("BROKEN")
  );
}

/* =========================
   ENV SCAN (OBSERVATION ONLY)
========================= */
function envCheck() {
  return {
    META_TOKEN: !!process.env.META_TOKEN,
    REDIS_URL: !!process.env.REDIS_URL,
    DB_URL: !!process.env.DB_URL,
    JWT_SECRET: !!process.env.JWT_SECRET,
    PORT: !!process.env.PORT
  };
}

/* =========================
   DRIFT SCAN (NO EXECUTION)
========================= */
function drift(files) {
  const map = {};

  for (const f of files) {
    map[f] = (map[f] || 0) + 1;
  }

  const groups = Object.values(map).filter(v => v > 1).length;

  return {
    duplicate_groups: groups,
    status:
      groups > 15 ? "🔴 HIGH_RISK" :
      groups > 5 ? "🟡 MEDIUM_RISK" :
      "🟢 LOW_RISK"
  };
}

/* =========================
   HEALTH SCORE (READ ONLY)
========================= */
function healthScore(env, servers, driftInfo) {
  let score = 100;

  const missingEnv = Object.values(env).filter(v => !v).length;
  score -= missingEnv * 12;

  if (servers.length === 0) score -= 30;
  if (driftInfo.duplicate_groups > 5) score -= 15;

  return Math.max(0, score);
}

/* =========================
   MAIN RUNNER
========================= */
function run() {
  const files = walk(".");

  const servers = detectServers(files);
  const env = envCheck();
  const driftInfo = drift(files);

  const health = healthScore(env, servers, driftInfo);

  const report = {
    "🧠 AFRISCAN": "OBSERVABILITY_CORE_V1",
    "🔐 MODE": "READ_ONLY_NO_AUTONOMY",

    "❤️ HEALTH": health,

    "🖥 SERVERS": {
      total: servers.length,
      list: servers.map((s, i) => ({
        id: i + 1,
        path: s
      }))
    },

    "🌐 ENV": env,
    "📦 DRIFT": driftInfo,

    "⏱ TIME": new Date().toISOString()
  };

  console.log("\n🧠 AFRISCAN CLEAN OBSERVABILITY");
  console.log("==============================\n");
  console.log(JSON.stringify(report, null, 2));
  console.log("\n==============================");
  console.log("🚀 DONE");
}

run();
