function assertRuntime(file) {
  if (!file.includes("dist/")) {
    throw new Error("RUNTIME VIOLATION: only dist allowed");
  }
}

module.exports = { assertRuntime };
