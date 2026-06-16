function format(d) {

  if (!d || !d.databases) {
    throw new Error("INVALID ENGINE CONTRACT: databases missing");
  }

  const s = d.servers;

  return `
┌──────────────────────────────────────────────┐
│              AFRISCAN CONTROL                │
├──────────────────────────────────────────────┤
│ STATE            ${d.state}
│ SCORE            ${d.score}/100
│ MODE             ${d.mode}
│ VERSION          ${d.version}
│ UPTIME           ${d.uptime}
└──────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 CORE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Score           → ${d.score}
🧭 State           → ${d.state}
⚙️ Mode            → ${d.mode}
🏷️ Version         → ${d.version}
⏱️ Uptime          → ${d.uptime}
🧠 Brain Status    → ${d.brain.status}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Backend         → ${s.backend}
🌐 Frontend        → ${s.frontend}
⚡ Latency         → ${s.latency_ms}ms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️ DATABASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍃 MongoDB         → ${d.databases.mongodb}
🔴 Redis           → ${d.databases.redis}
🧮 Postgres        → ${d.databases.postgres}
📦 Collections     → ${d.databases.collections}
📊 Records         → ${d.databases.records}
💾 Storage Used    → ${d.databases.storage_gb} GB
`.trim();
}

module.exports = { format };
