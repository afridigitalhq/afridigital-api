function line(label, value, pad = 22) {
  const left = String(label).padEnd(pad, " ");
  return `${left}→ ${value}`;
}

function section(title, rows) {
  const width = 46;
  const border = "─".repeat(width);

  let out = `\n━━━━━━━━ ${title} ━━━━━━━━\n`;
  rows.forEach(r => out += r + "\n");
  return out;
}

function render(data) {
  const header =
`┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN CONTROL             │
├──────────────────────────────────────────────┤
│ STATE            ${data.core.state}
│ SCORE            ${data.core.score}/100
│ MODE             ⚙️ OBS
│ VERSION          🏷️ ${data.version}
│ UPTIME           ⏱️ ${Math.floor(data.core.uptime)}
└──────────────────────────────────────────────┘`;

  const core = section("CORE STATUS", [
    line("Score", data.core.score),
    line("State", data.core.state),
    line("Mode", "OBS"),
    line("Version", data.version),
    line("Uptime", Math.floor(data.core.uptime))
  ]);

  const infra = section("INFRASTRUCTURE", [
    line("Servers", `${data.infrastructure.servers.active}/${data.infrastructure.servers.total}`),
    line("Primary", data.infrastructure.primary),
    line("Frontend", data.infrastructure.frontend),
    line("Latency", data.infrastructure.latency + "ms"),
    line("Availability", data.infrastructure.availability + "%")
  ]);

  const db = section("DATABASES", [
    line("MongoDB", data.databases.mongo),
    line("Redis", data.databases.redis),
    line("Postgres", data.databases.postgres)
  ]);

  const snap = section("SNAPSHOTS", [
    line("Total", data.snapshots.total),
    line("Latest", data.snapshots.latest || "null")
  ]);

  const tel = section("TELEMETRY", [
    line("CPU", data.telemetry.cpu),
    line("RAM", data.telemetry.ram),
    line("Requests", data.telemetry.requests)
  ]);

  const final =
`\n━━━━━━━━ FINAL STATUS ━━━━━━━━
STATE → ${data.core.state}`;

  return [header, core, infra, db, snap, tel, final].join("\n");
}

module.exports = { render };
