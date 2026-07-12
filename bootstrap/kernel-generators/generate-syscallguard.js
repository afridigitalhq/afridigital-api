const fs=require("fs");

const source=`const fs=require("fs");
const path=require("path");

function walk(dir,list=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory()){
      if(["freeze","release","recovery","seal","soc"].includes(e.name)) continue;
      walk(p,list);
    }else if(p.endsWith(".js")){
      list.push(p);
    }
  }
  return list;
}

function scan(file){
  return fs.readFileSync(file,"utf8");
}

function enforceNoMultipleInstances(){
  const allowed=[
    "core/kernel/index.js",
    "core/kernel/bootstrap/syscall.boot.js"
  ];

  const hits=[];

  for(const file of walk("core/kernel")){
    const txt=scan(file);
    if(txt.includes("REMOVED_ILLEGAL_INSTANTIATION") &&
       !allowed.some(a=>file.endsWith(a))){
      hits.push(file);
    }
  }

  if(hits.length){
    console.error("🚨 SYSCALLGATE MULTI-INSTANCE VIOLATION");
    console.error(hits.join("\\n"));
    process.exit(1);
  }

  return true;
}

function enforceSingleDispatch(kernel){
  if(!kernel||typeof kernel.dispatch!=="function"){
    throw new Error("SyscallGate invalid runtime: missing dispatch()");
  }
  return true;
}

module.exports={
  enforceNoMultipleInstances,
  enforceSingleDispatch
};
`;

fs.writeFileSync("core/kernel/_enforce/syscallgate.guard.cjs",source);

console.log("✅ Rebuilt syscallgate.guard.cjs");
