const dot = require('../ui/status.symbols');

const icon = (v) => dot(v);

const line = (label, value, status) =>
  `${icon(status)} ${label.padEnd(18)} → ${value}`;

const section = (t) => `\n━━━━━━━━ ${t.toUpperCase()} ━━━━━━━━`;

const header = (p) => `
┌──────────────────────────────────────────────┐
│              🧠 AFRISCAN OBSERVATORY         │
├──────────────────────────────────────────────┤
│ STATE            ${p.state}
│ SCORE            ${p.score}/100
│ MODE             OBS
│ VERSION          v3
│ UPTIME           ${Math.floor(p.uptime)}s
└──────────────────────────────────────────────┘`;

function render(p, c) {
  console.clear();

  console.log(header(p));

  console.log(section("CORE STATUS"));
  console.log(line("Score", p.score, p.state));
  console.log(line("State", p.state, p.state));
  console.log(line("Uptime", Math.floor(p.uptime) + "s"));

  console.log(section("INFRASTRUCTURE"));
  console.log(line("Servers", `${p.infra.servers.active}/${p.infra.servers.total}`, "ONLINE"));
  console.log(line("Primary", p.infra.primary, "ONLINE"));
  console.log(line("Frontend", p.infra.frontend, "ONLINE"));
  console.log(line("Latency", p.infra.latency + "ms"));
  console.log(line("Availability", p.infra.availability + "%"));

  console.log(section("DATABASES"));
  console.log(line("MongoDB", c.databases.mongo, c.databases.mongo));
  console.log(line("Redis", c.databases.redis, c.databases.redis));
  console.log(line("Postgres", c.databases.postgres, c.databases.postgres));
  console.log(line("DB Health", c.databases.dbHealth));

  console.log(section("ENVIRONMENT"));
  console.log(line("Secrets Valid", (c.environment?.secretsValid || 0) + "%"));
  console.log(line("Env Health", c.environment?.envHealth || "PASS"));
  console.log(line("Missing Vars", c.environment?.missingVars || 0));
}

module.exports = render;
