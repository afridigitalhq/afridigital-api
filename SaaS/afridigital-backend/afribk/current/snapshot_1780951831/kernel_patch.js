const fs = require('fs');

const file = './core/africore/runtime/kernel.js';
let code = fs.readFileSync(file, 'utf8');

// safe adapter injection
if (!code.includes("module.exports.handle")) {
  code += `

async function handle(input){
  return await run(input);
}

module.exports.handle = handle;
`;
}

fs.writeFileSync(file, code);
console.log("🧠 KERNEL SAFE ADAPTER APPLIED");
