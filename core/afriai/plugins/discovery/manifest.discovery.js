const fs = require("fs");
const path = require("path");
const validator = require("../manifest/manifest.validator");

function discover(dir) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;

    try {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(dir, file), "utf8")
      );

      const report = validator.validate(manifest);

      if (report.ok) {
        results.push({
          manifest,
          report
        });
      }

    } catch (err) {
      // Ignore invalid files safely
    }
  }

  return results;
}

module.exports = { discover };
