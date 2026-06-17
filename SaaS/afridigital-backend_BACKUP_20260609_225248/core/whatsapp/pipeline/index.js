const normalize = require("./normalize");
const intentAI = require("./intent.ai");
const context = require("./context");
const planner = require("./planner");
const router = require("./router");
const formatter = require("./formatter");

async function run(payload) {
  const n = normalize(payload);
  const i = intentAI(n.text);
  const c = context(n);
  const p = planner(i);
  const r = await router(p, c);
  return formatter(r, i);
}

module.exports = { run };
