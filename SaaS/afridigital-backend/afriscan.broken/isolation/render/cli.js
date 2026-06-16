// UI LAYER ONLY - DO NOT IMPORT INTO PIPELINE
const run = require('../../runtime/core/pipeline.js');

function line(label, value) {
  return `${label.padEnd(20)} → ${value ?? "N/A"}`;
}

function render() {
  const d = run();

  const infra = d.infra || {};
  const servers = infra.servers || {};

  const alert = d.state === "DEGRADED"
    ? "⚠️ SYSTEM DEGRADED"
    : "🟢 SYSTEM HEALTHY";

  console.clear();

  console.log(`
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN LIVE                │
├──────────────────────────────────────────────┤
│ STATE            ${d.state}
│ SCORE            ${d.score}/100
│ UPTIME           ${d.uptime}s
└──────────────────────────────────────────────┘

${alert}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 INFRA (LIVE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${line("📡 Servers Total", servers.total)}
${line("🟢 Active", servers.active)}
${line("🔴 Failed", servers.failed)}
${line("🧷 Primary", infra.primary)}
${line("🌐 Frontend", infra.frontend)}
${line("⚡ Latency", (infra.latency ?? 0) + "ms")}
${line("📶 Availability", (infra.availability ?? 0) + "%")}
`);
}

render();
