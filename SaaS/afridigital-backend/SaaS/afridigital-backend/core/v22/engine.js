const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");

function analyzeError(log) {
  if (log.includes("SyntaxError")) return "SYNTAX";
  if (log.includes("TypeError")) return "RUNTIME";
  if (log.includes("require")) return "DEPENDENCY";
  return "UNKNOWN";
}

function suggestFix(type, file) {
  if (type === "SYNTAX") {
    return `Check brackets, redeclared variables, missing commas in ${file}`;
  }
  if (type === "RUNTIME") {
    return `Validate function existence and null guards in ${file}`;
  }
  if (type === "DEPENDENCY") {
    return `Check module imports and missing packages in ${file}`;
  }
  return "Manual review required";
}

function runDiagnosis(log, file) {
  const type = analyzeError(log);
  const fix = suggestFix(type, file);

  return {
    type,
    file,
    fix,
    safe: type !== "UNKNOWN"
  };
}

module.exports = { runDiagnosis };
