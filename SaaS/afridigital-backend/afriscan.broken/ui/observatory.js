function render(pipeline, score, state) {
  const uptime = Math.floor(pipeline.uptime || 0);

  return `
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN CONTROL             │
├──────────────────────────────────────────────┤
│ STATE            ${state}
│ SCORE            ${score.score}/100
│ MODE             ⚙️ OBS
│ VERSION          🏷️ v3
│ UPTIME           ⏱️ ${uptime}s
└──────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CORE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Score              → ${score.score}
🧭 State              → ${state}
⚙️ Mode               → OBS
🏷️ Version            → v3
⏱️ Uptime             → ${uptime}s
🧠 Brain Status       → ACTIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Servers Total      → ${pipeline.infra.servers.total}
🟢 Active             → ${pipeline.infra.servers.active}
🔴 Failed             → ${pipeline.infra.servers.failed}
🧷 Primary            → ${pipeline.infra.primary}
🌐 Frontend           → ${pipeline.infra.frontend}
⚡ Latency            → ${pipeline.infra.latency}ms
📶 Availability       → ${pipeline.infra.availability}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️ DATABASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍃 MongoDB            → ${pipeline.db.mongo}
🔴 Redis              → ${pipeline.db.redis}
🧮 Postgres           → ${pipeline.db.postgres}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 SNAPSHOTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗂️ Total              → ${pipeline.snapshots.total}
📅 Latest             → ${pipeline.snapshots.latest}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TELEMETRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ CPU                → ${pipeline.telemetry.cpu}%
🧠 RAM                → ${pipeline.telemetry.ram}%
📨 Requests          → ${pipeline.telemetry.requests}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏁 FINAL STATUS → ${state}
`;
}

module.exports = { render };
