const fs = require("fs");

const file = process.argv[2];
if (!file) process.exit(1);

const code = fs.readFileSync(file, "utf-8");

const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
const requireRegex = /require\(['"](.*?)['"]\)/g;

let deps = [];
let m;

while ((m = importRegex.exec(code))) deps.push(m[1]);
while ((m = requireRegex.exec(code))) deps.push(m[1]);

deps = deps.filter(d => d && d.startsWith("."));

console.log(JSON.stringify({
  file,
  dependencies: deps,
  count: deps.length
}, null, 2));
