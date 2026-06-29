const fs=require("fs");

const file="server.js";
let s=fs.readFileSync(file,"utf8");

// Remove every old kernel bootstrap block
s=s.replace(/const kernel=createKernel\?createKernel\(\{\}\):\{\};\s*if\(kernel\)\s*mountKernelObservability\(app,kernel\);\s*/gs,"");
s=s.replace(/const kernel=createKernel\(\{\}\);\s*mountKernelObservability\(app,kernel\);\s*/gs,"");

// Remove duplicate imports
s=s.replace(/const createKernel=require\("\.\/core\/kernel\/bootstrap\/syscall\.boot"\)\.createKernel;\s*/gs,"");
s=s.replace(/const mountKernelObservability=require\("\.\/core\/kernel\/contract\/observability\.routes"\);\s*/gs,"");

// Insert imports immediately after attack topology import
const importAnchor='const { getAttackTopology } = require("./core/intelligence/attack.topology");';

const imports=`const createKernel=require("./core/kernel/bootstrap/syscall.boot").createKernel;
const mountKernelObservability=require("./core/kernel/contract/observability.routes");`;

s=s.replace(importAnchor,importAnchor+"\n"+imports);

// Insert boot immediately after the imports
const bootAnchor='const mountKernelObservability=require("./core/kernel/contract/observability.routes");';

const boot=`const kernel=createKernel({});
mountKernelObservability(app,kernel);`;

s=s.replace(bootAnchor,bootAnchor+"\n\n"+boot);

fs.writeFileSync(file,s);

console.log("🟢 Server bootstrap rebuilt from canonical template");
