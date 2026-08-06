import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function buildDependencyGraph() {
  console.log("\n🕸 AfriDebug Dependency Graph Builder\n");

  const packagePath = path.resolve(process.cwd(), "package.json");

  if (!fs.existsSync(packagePath)) {
    console.log("❌ package.json not found");
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

  const dependencies = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };

  const graph = {
    project: pkg.name,
    version: pkg.version,
    dependencyCount: Object.keys(dependencies).length,
    dependencies: Object.keys(dependencies)
  };

  fs.mkdirSync("modules/afridebug/evidence", { recursive: true });

  fs.writeFileSync(
    "modules/afridebug/evidence/dependency-graph.json",
    JSON.stringify(graph, null, 2)
  );

  console.log(`📦 Project: ${graph.project}`);
  console.log(`🔗 Dependencies detected: ${graph.dependencyCount}`);
  console.log("✅ Dependency graph generated");
  console.log("📄 Saved: modules/afridebug/evidence/dependency-graph.json");

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(buildDependencyGraph() ? 0 : 1);
}
