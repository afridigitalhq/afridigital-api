const fs=require("fs");

const file="server.js";
let s=fs.readFileSync(file,"utf8");

function addOnce(anchor,code){
  if(s.includes(code.trim())) return;
  s=s.replace(anchor,anchor+"\n"+code);
}

addOnce(
'const { getAttackTopology } = require("./core/intelligence/attack.topology");',
`const createKernel=require("./core/kernel/bootstrap/syscall.boot").createKernel;
const mountKernelObservability=require("./core/kernel/contract/observability.routes");`
);

addOnce(
'const server = http.createServer(app);',
`const kernel=createKernel?createKernel({}):{};
if(kernel) mountKernelObservability(app,kernel);`
);

fs.writeFileSync(file,s);

console.log("✅ Kernel bootstrap wired.");
