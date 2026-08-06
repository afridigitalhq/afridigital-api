import fs from "fs";
import path from "path";

export function validate() {
  console.log("\n🔌 Plugin Validation\n");

  const manifests = [];

  function scan(dir) {
    if (!fs.existsSync(dir)) return;

    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);

      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (item.endsWith(".manifest.json")) {
        manifests.push(full);
      }
    }
  }

  scan("modules");
  scan("core");

  if (manifests.length === 0) {
    console.log("❌ No plugin manifests found");
    return false;
  }

  let valid = true;

  for (const file of manifests) {
    try {
      const manifest = JSON.parse(fs.readFileSync(file, "utf8"));

      if (!manifest.name) {
        console.log(`❌ Missing name: ${file}`);
        valid = false;
      } else {
        console.log(`✅ ${manifest.name}`);
      }
    } catch {
      console.log(`❌ Invalid JSON: ${file}`);
      valid = false;
    }
  }

  console.log(`\n📊 Plugin manifests: ${manifests.length}`);
  console.log(valid ? "🟢 Plugin Validation PASSED" : "🔴 Plugin Validation FAILED");

  return valid;
}
