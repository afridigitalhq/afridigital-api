const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MODULES = path.join(ROOT, "modules");

function log(msg) {
  console.log("[V4-HEAL]", msg);
}

function exists(mod) {
  return fs.existsSync(path.join(MODULES, mod));
}

function tryFixRequire(content, modName) {
  return content.replace(
    new RegExp(`require\\(['"\`]\\.\\./${modName}['"\`]\\)`,'g'),
    `require('../${modName}')`
  );
}

function scanBrokenImports() {
  const modules = fs.readdirSync(MODULES).filter(m => !m.startsWith("."));

  const issues = [];

  for (const mod of modules) {
    const file = path.join(MODULES, mod, "index.js");
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, "utf-8");

    const matches = [...content.matchAll(/require\(['"`]\.\.\/(.*?)['"`]\)/g)];

    for (const m of matches) {
      const dep = m[1];

      if (!exists(dep)) {
        issues.push({ mod, dep });
      }
    }
  }

  return issues;
}

function healMissingModules(issues) {
  for (const i of issues) {
    const alt = "_" + i.dep;

    if (exists(alt)) {
      fs.renameSync(
        path.join(MODULES, alt),
        path.join(MODULES, i.dep)
      );
      log(`restored missing module ${i.dep}`);
    } else {
      log(`UNRESOLVED dependency: ${i.mod} → ${i.dep}`);
    }
  }
}

function simulateBoot() {
  log("simulating boot dependency graph...");

  const issues = scanBrokenImports();

  if (issues.length === 0) {
    log("no broken dependencies detected");
    return true;
  }

  log(`found ${issues.length} dependency issues`);

  issues.forEach(i => {
    log(`❌ ${i.mod} → missing ${i.dep}`);
  });

  if (issues.length > 10) {
    log("🛑 HIGH RISK BOOT BLOCKED");
    return false;
  }

  return true;
}

function runHeal() {
  log("V4 SELF-HEAL ACTIVE");

  const issues = scanBrokenImports();

  if (issues.length > 0) {
    healMissingModules(issues);
  }

  const safe = simulateBoot();

  if (!safe) {
    process.exit(1);
  }

  log("system healthy");
}

module.exports = { runHeal };
