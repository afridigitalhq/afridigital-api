import fs from "fs";
import path from "path";

export function validate() {
  console.log("\n🛣 Route Validation\n");

  const routes = [];

  function scan(dir) {
    if (!fs.existsSync(dir)) return;

    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);

      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (
        item.endsWith(".routes.js") ||
        item === "routes.js" ||
        item.endsWith("Routes.js")
      ) {
        routes.push(full);
      }
    }
  }

  scan("src");
  scan("modules");

  if (routes.length === 0) {
    console.log("❌ No route files found");
    return false;
  }

  routes.sort().forEach(route => console.log(`✅ ${route}`));

  console.log(`\n📊 Route files: ${routes.length}`);
  console.log("🟢 Route Validation PASSED");

  return true;
}
