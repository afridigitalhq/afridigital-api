const fs=require("fs");

const file="server.js";
let s=fs.readFileSync(file,"utf8");

const importLine='const { bus } = require("./bootstrap/ws-eventbus/output/eventbus");';

if(!s.includes(importLine)){
  const anchor='const mountKernelObservability=require("./core/kernel/contract/observability.routes");';
  if(s.includes(anchor)){
    s=s.replace(anchor,anchor+"\n"+importLine);
  }
}

const bootLine='kernel.eventBus = bus;';

if(!s.includes(bootLine)){
  const anchor='mountKernelObservability(app,kernel);';
  if(s.includes(anchor)){
    s=s.replace(anchor,anchor+"\n"+bootLine);
  }
}

fs.writeFileSync(file,s);

console.log("🟢 EVENT BUS INSTALLED INTO KERNEL");
