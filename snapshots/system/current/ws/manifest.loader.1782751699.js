const discovery = require("../discovery/manifest.discovery");
const registry = require("../manifest/manifest.registry");

function load(dir) {
  const results = discovery.discover(dir);

  const loaded = [];

  for (const item of results) {
    if (!item.report.ok) continue;

    registry.register(item.manifest);
    loaded.push(item.manifest.id);
  }

  return {
    ok: true,
    loaded,
    total: loaded.length
  };
}

module.exports = { load };
