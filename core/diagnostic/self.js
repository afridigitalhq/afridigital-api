function diagnose(event) {
  if (!event) return { status: "unknown" };

  if (event.type === "error") {
    return { status: "failure", category: "runtime" };
  }

  return { status: "healthy" };
}

module.exports = { diagnose };
