function render(t) {
  const score = t.score?.score || 0;
  const state = score < 60 ? "DEGRADED" : "STABLE";

  return `
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN LIVE                │
├──────────────────────────────────────────────┤
│ STATE            ${state}
│ SCORE            ${score}/100
│ MODE             LIVE-SAFE v2
│ UPTIME           ${t.core.uptime}s
└──────────────────────────────────────────────┘

🧠 BREAKDOWN
Infra: ${t.score.breakdown.infra}
DB: ${t.score.breakdown.databases}
Security: ${t.score.breakdown.security}
AI: ${t.score.breakdown.ai}
Telemetry: ${t.score.breakdown.telemetry}
Core: ${t.score.breakdown.core}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 SYSTEM STATUS: ${state}
`;
}

module.exports = render;
