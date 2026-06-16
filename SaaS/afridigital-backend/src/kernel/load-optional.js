function loadOptional(name, factory) {
  try {
    const mod = factory();
    return { ok: true, name, module: mod };
  } catch (e) {
    return { ok: false, name, error: e.message };
  }
}
module.exports = { loadOptional };
