const fs = require("fs");
const path = require("path");

/**
 * KERNEL GUARD MODE
 * Prevents unauthorized execution paths in AfriCore
 */

const ALLOWED_ENTRYPOINT = path.resolve(
  __dirname,
  "../runtime/entrypoint.js"
);

function isAllowedCaller() {
  const stack = new Error().stack || "";
  return stack.includes("entrypoint.js");
}

function validateRuntime() {
  const violations = [];

  const dangerousFiles = [
    
    
    "start-worker.js"
  ];

  for (const file of dangerousFiles) {
    const full = path.join(process.cwd(), file);
    if (fs.existsSync(full)) {
      violations.push(`UNCONTROLLED_RUNTIME_FILE: ${file}`);
    }
  }

  return violations;
}

function guard(eventName = "unknown") {
  const violations = validateRuntime();

  if (violations.length > 0) {
    console.log("🚨 KERNEL GUARD TRIGGERED");
    console.log(violations);

    throw new Error(
      "KERNEL_LOCKED: Unauthorized execution path detected"
    );
  }

  if (!isAllowedCaller()) {
    throw new Error(
      `KERNEL_LOCKED: Event '${eventName}' not executed via entrypoint`
    );
  }

  return true;
}

module.exports = {
  guard
};
