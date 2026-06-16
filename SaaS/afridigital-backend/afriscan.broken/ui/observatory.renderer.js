function render(p) {
  const s = p?.score ?? 0;
  const state = p?.state ?? "UNKNOWN";
  const uptime = Math.floor(p?.uptime ?? 0);

  return `
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN CONTROL             │
├──────────────────────────────────────────────┤
│ STATE            ${state}
│ SCORE            ${s}/100
│ MODE             ⚙️ OBS
│ VERSION          🏷️ v3.5
│ UPTIME           ⏱️ ${uptime}
└──────────────────────────────────────────────┘

━━━━━━━━ CORE STATUS ━━━━━━━━
📈 Score              → ${s}
🧭 State              → ${state}
⚙️ Mode               → OBS
🏷️ Version            → v3.5
⏱️ Uptime             → ${uptime}

━━━━━━━━ INFRASTRUCTURE ━━━━━━━━
📡 Servers Total      → ${p?.infra?.servers?.total ?? 0}
🟢 Active             → ${p?.infra?.servers?.active ?? 0}
🔴 Failed             → ${p?.infra?.servers?.failed ?? 0}
🧷 Primary            → ${p?.infra?.primary ?? "N/A"}
🌐 Frontend           → ${p?.infra?.frontend ?? "N/A"}
⚡ Latency            → ${p?.infra?.latency ?? 0}ms
📶 Availability       → ${p?.infra?.availability ?? 0}

━━━━━━━━ DATABASES (EXPANDED) ━━━━━━━━
🍃 MongoDB            → ${p?.db?.mongo ?? "UNKNOWN"}
🔴 Redis              → ${p?.db?.redis ?? "UNKNOWN"}
🧮 Postgres           → ${p?.db?.postgres ?? "UNKNOWN"}
📊 DB Health Score    → ${p?.db?.health ?? 0}
🧠 DB Mode            → ${p?.db?.mode ?? "OBS"}

━━━━━━━━ META SYSTEM (EXPANDED) ━━━━━━━━
📱 Phone ID           → ${p?.meta?.phoneId ?? "N/A"}
🔐 Token Status       → ${p?.meta?.tokenStatus ?? "UNKNOWN"}
📨 Messages Today     → ${p?.meta?.messagesToday ?? 0}
❌ Failed Requests    → ${p?.meta?.failed ?? 0}
📥 Webhooks Status    → ${p?.meta?.webhooks ?? "UNKNOWN"}
🧠 Integrity Score    → ${p?.meta?.integrity ?? 0}
⚙️ Event Flow         → ${p?.meta?.eventFlow ?? "UNKNOWN"}

━━━━━━━━ SNAPSHOTS (UPGRADED) ━━━━━━━━
🗂️ Total              → ${p?.snapshots?.total ?? 0}
📅 Latest             → ${p?.snapshots?.latest ?? "null"}
🏷️ Last Backup Ver    → ${p?.snapshots?.version ?? "N/A"}
🧬 Backup Integrity   → ${p?.snapshots?.integrity ?? 0}
♻️ Restore Ready      → ${p?.snapshots?.restoreReady ?? "UNKNOWN"}

━━━━━━━━ TELEMETRY ━━━━━━━━
⚡ CPU                → ${p?.telemetry?.cpu ?? 0}
🧠 RAM                → ${p?.telemetry?.ram ?? 0}
📨 Requests          → ${p?.telemetry?.requests ?? 0}

━━━━━━━━ FINAL STATUS ━━━━━━━━
STATE → ${state}
`;
}

module.exports = { render };
