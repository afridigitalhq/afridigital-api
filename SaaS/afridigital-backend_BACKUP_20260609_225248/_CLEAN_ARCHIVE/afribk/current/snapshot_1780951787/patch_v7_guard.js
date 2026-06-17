const fs = require("fs");

let k = fs.readFileSync("core/kernel/afriKernelV7.js", "utf8");

// prevent double patching
if (!k.includes("v7Guard")) {

  k = k.replace(
    'const { pop } = require("../queue/eventQueue");',
    `const { pop } = require("../queue/eventQueue");
const { throttleQueue } = require("../stability/v7Guard");`
  );

  k = k.replace(
    "const event = pop();",
    "const event = pop();\n      await throttleQueue(1);"
  );

  fs.writeFileSync("core/kernel/afriKernelV7.js", k);
  console.log("✔ V7 stability patch applied safely");
} else {
  console.log("✔ already patched");
}
