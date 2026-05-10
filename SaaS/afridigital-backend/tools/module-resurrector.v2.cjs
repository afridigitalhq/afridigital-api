const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MODULES = path.join(ROOT, "modules");
const LOCK = path.join(ROOT, "modules-deps.lock.json");

const deps = fs.existsSync(LOCK)
  ? JSON.parse(fs.readFileSync(LOCK, "utf-8"))
  : {};

function log(msg) {
  console.log("[V2-RESURRECTOR]", msg);
}

function exists(mod) {
  return fs.existsSync(path.join(MODULES, mod));
}

function restore(mod) {
  const disabled = path.join(MODULES, "_" + mod);
  const active = path.join(MODULES, mod);

  if (fs.existsSync(active)) return true;
  if (fs.existsSync(disabled)) {
    fs.renameSync(disabled, active);
    log(`restored ${mod}`);
    return true;
  }
  return false;
}

function resolveDependencies() {
  log("scanning dependency graph...");

  for (const mod in deps) {
    const list = deps[mod];

    for (const dep of list) {
      if (!exists(dep)) {
        log(`missing dependency detected: ${mod} → ${dep}`);
        const ok = restore(dep);

        if (!ok) {
          log(`FATAL: cannot restore ${dep}`);
          process.exit(1);
        }
      }
    }
  }

  log("dependency resolution complete");
}

function scanDisabledModules() {
  const files = fs.readdirSync(MODULES);

  files.forEach((f) => {
    if (f.startsWith("_")) {
      const clean = f.replace("_", "");

      if (!exists(clean)) {
        restore(clean);
      }
    }
  });
}

function boot() {
  log("V2 AUTO RESURRECTOR ACTIVE");

  resolveDependencies();
  scanDisabledModules();

  log("system stabilized");
}

module.exports = { boot };
