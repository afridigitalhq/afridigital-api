const fs = require("fs");

const ROOT = process.cwd();

function scanFile(file) {
  try {
    const code = fs.readFileSync(file, "utf-8");

    const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
    const requireRegex = /require\(['"](.*?)['"]\)/g;

    let deps = [];
    let m;

    while ((m = importRegex.exec(code))) deps.push(m[1]);
    while ((m = requireRegex.exec(code))) deps.push(m[1]);

    return deps.filter(d => d && d.startsWith("."));
  } catch (e) {
    return [];
  }
}

function walk(dir, out = []) {
  let items = [];

  try {
    items = fs.readdirSync(dir);
  } catch (e) {
    return out;
  }

  for (const item of items) {
    const path = `${dir}/${item}`;

    try {
      const stat = fs.statSync(path);

      if (stat.isDirectory()) {
        walk(path, out);
      } else if (path.endsWith(".js")) {
        out.push(path);
      }
    } catch (e) {
      // 🧠 SAFE IGNORE: race condition / deleted file
      continue;
    }
  }

  return out;
}

const files = walk(ROOT);

let graph = {};

for (const file of files) {
  graph[file] = scanFile(file);
}

fs.mkdirSync(".kernel", { recursive: true });

fs.writeFileSync(
  ".kernel/graph.json",
  JSON.stringify(graph, null, 2)
);

console.log("🧠 ARCHITECTURE MEMORY GRAPH BUILT");
console.log("📦 FILES ANALYZED:", files.length);
console.log("📁 GRAPH STORED → .kernel/graph.json");
