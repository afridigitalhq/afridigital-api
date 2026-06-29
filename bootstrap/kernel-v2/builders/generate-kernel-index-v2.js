const fs=require("fs");

const source=`const { createKernel } = require("./createKernel");

module.exports = createKernel(process.env || {});
`;

fs.writeFileSync("bootstrap/kernel-v2/output/kernel-index.js",source);
fs.writeFileSync("core/kernel/index.js",source);

console.log("✅ Kernel V2 index generated");
console.log("✅ core/kernel/index.js updated");
