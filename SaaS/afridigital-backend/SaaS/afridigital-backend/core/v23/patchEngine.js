const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");
const exec = require("child_process").execSync;

function detectType(error) {
  if (error.includes("SyntaxError")) return "SYNTAX";
  if (error.includes("TypeError")) return "RUNTIME";
  return "UNKNOWN";
}

function generatePatch(file, type) {
  if (type === "SYNTAX") {
    return {
      file,
      action: "review_syntax",
      safe: true,
      message: "Fix missing brackets, redeclared variables, or broken imports"
    };
  }

  if (type === "RUNTIME") {
    return {
      file,
      action: "add_null_guards",
      safe: true,
      message: "Add defensive checks for undefined objects/functions"
    };
  }

  return {
    file,
    action: "manual_review",
    safe: false
  };
}

function applySafePatch(patch) {
  if (!patch.safe) return false;

  console.log("🛠 Applying safe patch strategy:", patch);

  // V23 SAFETY RULE: no destructive edits
  fs.appendFileSync(
    "V23_PATCH_LOG.txt",
    JSON.stringify(patch, null, 2) + "\n"
  );

  return true;
}

module.exports = { detectType, generatePatch, applySafePatch };
