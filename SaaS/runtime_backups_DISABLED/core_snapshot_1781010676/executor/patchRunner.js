const fs = require("fs");

/**
 * PATCH RUNNER V7.5
 * Ensures idempotent system modifications
 */
function applyPatch(file, transformFn) {
  if (!fs.existsSync(file)) {
    console.log("❌ Missing file:", file);
    return false;
  }

  let content = fs.readFileSync(file, "utf8");
  const original = content;

  content = transformFn(content);

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("✔ Patched:", file);
    return true;
  }

  console.log("✔ No changes needed:", file);
  return false;
}

module.exports = { applyPatch };
