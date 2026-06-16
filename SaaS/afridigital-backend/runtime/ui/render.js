function icon(v){
  if (v === true || v === "ONLINE" || v === "ACTIVE" || v === "VALID") return "🟢";
  if (v === "UNKNOWN" || v === "DEGRADED") return "🟡";
  if (v === false || v === "FAILED" || v === "OFFLINE") return "🔴";
  return "⚪";
}

function line(l,v,s){
  return `${icon(s)} ${l.padEnd(20)} → ${v}`;
}

function section(t){
  return `\n━━━━━━━━ ${t.toUpperCase()} ━━━━━━━━`;
}

function header(p){
  return `
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN CONTROL             │
├──────────────────────────────────────────────┤
│ STATE            ${p.state}
│ SCORE            ${p.score}/100
│ UPTIME           ${Math.floor(p.uptime)}s
└──────────────────────────────────────────────┘`;
}

module.exports = { icon, line, section, header };
