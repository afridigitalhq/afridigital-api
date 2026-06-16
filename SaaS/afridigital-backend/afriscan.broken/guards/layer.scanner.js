const fs = require("fs");
const { detectUI } = require("./ui.detector");
const policy = require("./layer.policy");

const LAYERS = {
  pipeline: ["afriscan/runtime/core/pipeline.js"],
  format: [
    "afriscan/format/cliFormatter.js"
  ],
  renderer: [
    "afriscan/renderer/cli.js"
  ]
};

function scan() {
  const violations = [];

  for (const layer in LAYERS) {
    for (const file of LAYERS[layer]) {
      if (!fs.existsSync(file)) continue;

      const code = fs.readFileSync(file, "utf8");
      const uiHits = detectUI(code);

      const rules = policy[layer];

      if (!rules.allowUI && uiHits.length > 0) {
        violations.push({
          file,
          layer,
          type: "UI_LEAK",
          hits: uiHits
        });
      }
    }
  }

  return {
    ok: violations.length === 0,
    violations
  };
}

module.exports = scan;
