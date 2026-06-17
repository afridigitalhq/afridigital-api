const fs = require("fs");
const vm = require("vm");

/**
 * BASIC SYNTAX VALIDATION (Node-safe parse check)
 */
function isValidJS(code) {
  try {
    new vm.Script(code);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * READ FILE SAFELY
 */
function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

/**
 * WRITE FILE SAFELY (ONLY IF VALID)
 */
function safeWrite(filePath, newCode) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist: " + filePath);
  }

  if (!isValidJS(newCode)) {
    throw new Error("❌ PATCH BLOCKED: Invalid JavaScript syntax detected");
  }

  fs.writeFileSync(filePath, newCode, "utf8");

  console.log("🟢 PATCH APPLIED SAFELY:", filePath);
}

/**
 * PATCH FUNCTION (controlled replace only)
 */
function patch(filePath, replaceFn) {
  const original = read(filePath);
  const updated = replaceFn(original);

  safeWrite(filePath, updated);
}

module.exports = {
  patch,
  read,
  safeWrite,
  isValidJS
};
