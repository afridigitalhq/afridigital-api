const registry = require("../manifest/manifest.registry");
const runtime = require("../runtime/plugin.runtime");

function activate(id) {
  const manifest = registry.get(id);

  if (!manifest) {
    return {
      ok: false,
      error: "MANIFEST_NOT_FOUND",
      id
    };
  }

  return runtime.start(id);
}

function deactivate(id) {
  return runtime.stop(id);
}

module.exports = {
  activate,
  deactivate
};
