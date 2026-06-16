function render(d) {
  return `
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN CONTROL             │
├──────────────────────────────────────────────┤
│ STATE            ${d.state}
│ SCORE            ${d.score}/100
│ MODE             ⚙️ ${d.mode}
│ VERSION          🏷️ ${d.version}
│ UPTIME           ⏱️ ${Math.round(d.uptime || 0)}
└──────────────────────────────────────────────┘

━━━━━━━━ CORE STATUS ━━━━━━━━
📈 Score              → ${d.score}
🧭 State              → ${d.state}
⚙️ Mode               → ${d.mode}
🏷️ Version            → ${d.version}

━━━━━━━━ INFRASTRUCTURE ━━━━━━━━
📡 Servers Total      → ${d.infra?.servers?.total || 0}
🟢 Active             → ${d.infra?.servers?.active || 0}
🔴 Failed             → ${d.infra?.servers?.failed || 0}
🧷 Primary            → ${d.infra?.primary}

━━━━━━━━ DATABASES ━━━━━━━━
🍃 MongoDB            → ${d.db?.mongo}
🔴 Redis              → ${d.db?.redis}
🧮 Postgres           → ${d.db?.postgres}

━━━━━━━━ TELEMETRY ━━━━━━━━
⚡ CPU                → ${d.telemetry?.cpu}
🧠 RAM                → ${d.telemetry?.ram}
📨 Requests          → ${d.telemetry?.requests}

━━━━━━━━ FINAL STATUS ━━━━━━━━
STATE → ${d.state}
`;
}

module.exports = { render };
