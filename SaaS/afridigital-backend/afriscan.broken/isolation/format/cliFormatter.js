const run = require('../../runtime/core/pipeline.js');

function line(label, value) {
  return `${label.padEnd(20)} → ${value}`;
}

function render() {
  const d = run();

  const alert = d.state === "DEGRADED"
    ? "⚠️ SYSTEM DEGRADED"
    : "🟢 SYSTEM HEALTHY";

  console.clear();

  console.log(`
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN CONTROL             │
├──────────────────────────────────────────────┤
│ 🧭 STATE            ${d.state}
│ 📊 SCORE            ${d.score}/100
│ ⚙️ MODE             OBS
│ ⏱️ UPTIME           ${d.uptime}s
└──────────────────────────────────────────────┘

${alert}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${line("📊 Score", d.score)}
${line("🧭 State", d.state)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${line("📡 Servers Total", d.infra.servers.total)}
${line("🟢 Active", d.infra.servers.active)}
${line("🔴 Failed", d.infra.servers.failed)}
${line("🧷 Primary", d.infra.primary)}
${line("🌐 Frontend", d.infra.frontend)}
${line("⚡ Latency", d.infra.latency + "ms")}
${line("📶 Availability", d.infra.availability + "%")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️ DATABASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${line("🍃 MongoDB", d.db.mongo)}
${line("🔴 Redis", d.db.redis)}
${line("🧮 Postgres", d.db.postgres)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 META / WHATSAPP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${line("🟢 Meta API", d.meta.status || "UNKNOWN")}
${line("📱 Phone ID", d.meta.phoneId || "N/A")}
${line("📨 Messages", d.meta.messagesToday || 0)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 SNAPSHOTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${line("🗂️ Total", d.snapshots.total || 0)}
${line("📅 Latest", d.snapshots.latest || "null")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏁 STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${alert}
`);
}

module.exports = render;
