import fs from "fs";
import path from "path";
import GraphWorker from "../../../../src/afridebug/platform/workers/AfriDebugDependencyGraphWorker.js";

export function buildDependencyGraph(input = {}) {
  console.log("\n🕸 AfriDebug Dependency Graph Builder\n");

  const graph = GraphWorker.execute({
    investigationId: input.investigationId || `CERT-GRAPH-${Date.now()}`,
    repository: {
      type: input.type || "local",
      url: input.url || null,
      branch: input.branch || "main",
      path: input.path || process.cwd()
    }
  });

  if (graph.status !== "GRAPH_COMPLETED") {
    console.log(`❌ Dependency graph failed: ${graph.error || "unknown error"}`);
    return false;
  }

  fs.mkdirSync("modules/afridebug/evidence", { recursive: true });

  fs.writeFileSync(
    path.resolve(
      "modules/afridebug/evidence/dependency-graph.json"
    ),
    JSON.stringify(graph, null, 2)
  );

  console.log(`📦 Files: ${graph.files}`);
  console.log(`🔗 Imports: ${graph.imports}`);
  console.log(`🏠 Local imports: ${graph.localImports}`);
  console.log(`🌐 External imports: ${graph.externalImports}`);
  console.log("✅ Canonical dependency graph generated");
  console.log("📄 Saved: modules/afridebug/evidence/dependency-graph.json");

  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(buildDependencyGraph() ? 0 : 1);
}
