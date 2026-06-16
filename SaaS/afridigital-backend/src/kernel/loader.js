function loadOptional(name, fn) {
  try {
    return { status: "OK", module: name, value: fn() };
  } catch (e) {
    return { status: "SKIPPED", module: name, error: e.message };
  }
}
module.exports = { loadOptional };
