const load = (name, path) => {
  try {
    const mod = require(path);
    console.log("✔ loaded:", name);
    return { name, status: "loaded", mod };
  } catch (e) {
    console.log("⚠ skipped:", name);
    return { name, status: "skipped" };
  }
};

async function bootstrapKernel(app) {
  const loaded = [];
  const skipped = [];

  const core = [
    ["whatsapp-ci", "../modules/whatsapp-ci"],
    ["event-engine", "../modules/event-engine"],
    ["ci", "../modules/ci"]
  ];

  for (const [name, path] of core) {
    const r = load(name, path);
    r.status === "loaded" ? loaded.push(r) : skipped.push(r);
  }

  const routes = require("../routes");
  routes(app);

  return { loaded, skipped };
}

module.exports = { bootstrapKernel };
