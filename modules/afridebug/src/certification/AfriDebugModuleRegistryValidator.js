import fs from "fs";
import path from "path";

export function validate() {
  console.log("\n📦 Module Registry Validation\n");

  const modulesDir = "modules";

  if (!fs.existsSync(modulesDir)) {
    console.log("❌ modules directory not found");
    return false;
  }

  const modules = fs.readdirSync(modulesDir)
    .filter(name => fs.statSync(path.join(modulesDir, name)).isDirectory())
    .sort();

  if (modules.length === 0) {
    console.log("❌ No modules found");
    return false;
  }

  for (const moduleName of modules) {
    console.log(`✅ ${moduleName}`);
  }

  console.log(`\n📊 Total modules: ${modules.length}`);
  console.log("🟢 Module Registry Validation PASSED");

  return true;
}
