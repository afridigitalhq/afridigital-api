#!/data/data/com.termux/files/usr/bin/bash

cd "$(dirname "$0")"

node -e "
const afri = require('./afriscan');

const p = afri.pipeline();
const s = afri.score();
const state = afri.state();

function pad(n, len=3){ return String(n).padStart(len,' '); }

console.log(\`
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN CONTROL             │
├──────────────────────────────────────────────┤
│ STATE            \${state}
│ SCORE            \${s.score}/100
│ MODE             ⚙️ OBS
│ VERSION          🏷️ v3
│ UPTIME           ⏱️ \${Math.floor(p.uptime || 0)}s
└──────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CORE STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Score              → \${s.score}
🧭 State              → \${state}
⚙️ Mode               → OBS
🏷️ Version            → v3
⏱️ Uptime             → \${Math.floor(p.uptime || 0)}s

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌍 INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Servers Total      → \${p.infra.servers.total}
🟢 Active             → \${p.infra.servers.active}
🔴 Failed             → \${p.infra.servers.failed}
🧷 Primary            → \${p.infra.primary}
🌐 Frontend           → \${p.infra.frontend}
⚡ Latency            → \${p.infra.latency}ms
📶 Availability       → \${p.infra.availability}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️ DATABASES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍃 MongoDB            → \${p.db.mongo}
🔴 Redis              → \${p.db.redis}
🧮 Postgres           → \${p.db.postgres}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 SNAPSHOTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗂️ Total              → \${p.snapshots.total}
📅 Latest             → \${p.snapshots.latest}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TELEMETRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ CPU                → \${p.telemetry.cpu}%
🧠 RAM                → \${p.telemetry.ram}%
📨 Requests          → \${p.telemetry.requests}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏁 FINAL STATUS → \${state}
\`);
"
