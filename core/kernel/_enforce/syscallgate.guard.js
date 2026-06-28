const fs = require("fs");

function scan(file) {
  try {
    return fs.readFileSync(file, "utf-8");
  } catch (e) {
    return "";
  }
}

function enforceNoMultipleInstances() {
  const output = require("child_process")
    .execSync("grep -R \"// REMOVED_ILLEGAL_INSTANTIATION\" core/kernel 2>/dev/null || true")
    .toString();

  const lines = output.split("\n").filter(Boolean);

  // allow only boot + index canonical entry
  const allowed = [
    "core/kernel/index.js",
    "core/kernel/bootstrap/syscall.boot.js"
  ];

  const violations = lines.filter(l =>
    !allowed.some(a => l.includes(a))
  );

  if (violations.length > 0) {
    console.error("🚨 SYSYSCALLGATE MULTI-INSTANCE VIOLATION DETECTED");
    console.error(violations.join("\n"));
    process.exit(1);
  }

  return true;
}

function enforceSingleDispatch(kernel) {
  if (!kernel || typeof kernel.dispatch !== "function") {
    throw new Error("SyscallGate invalid runtime: missing dispatch()");
  }
  return true;
}

module.exports = {
  enforceNoMultipleInstances,
  enforceSingleDispatch
};
