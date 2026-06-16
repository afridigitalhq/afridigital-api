module.exports = function safeRun(fn, fallback = null) {
  try { return fn(); }
  catch (e) {
    console.log("⚠ SAFE FAIL:", e.message);
    return fallback;
  }
};
