const fs = require("fs");
const acorn = require("acorn");

const file = process.argv[2];

if (!file) {
  console.log("⛔ FILE REQUIRED");
  process.exit(1);
}

const code = fs.readFileSync(file, "utf-8");

let ast;
try {
  ast = acorn.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module"
  });
} catch (e) {
  console.log("⛔ AST PARSE ERROR");
  process.exit(1);
}

let functions = 0;
let classes = 0;
let exports = 0;

function walk(node) {
  if (!node || typeof node !== "object") return;

  if (node.type === "FunctionDeclaration") functions++;
  if (node.type === "ClassDeclaration") classes++;
  if (node.type === "ExportNamedDeclaration") exports++;

  for (let key in node) {
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach(walk);
    } else {
      walk(value);
    }
  }
}

walk(ast);

console.log(JSON.stringify({
  file,
  functions,
  classes,
  exports
}, null, 2));
