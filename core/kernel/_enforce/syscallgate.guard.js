const fs=require("fs");

const IGNORE_DIRS=[
  "freeze",
  "release",
  "recovery",
  "seal",
  "soc",
  "_enforce"
];

function isIgnored(file){
  return IGNORE_DIRS.some(d=>file.includes("/"+d+"/"));
}

function scanAll(dir){
  const fs=require("fs");
  const path=require("path");

  let results=[];

  function walk(d){
    for(const e of fs.readdirSync(d,{withFileTypes:true})){
      const p=path.join(d,e.name);
      if(e.isDirectory()) walk(p);
      else if(p.endsWith(".js")) results.push(p);
    }
  }

  walk(dir);
  return results;
}

function enforceNoMultipleInstances(){
  const allowed=[
    "core/kernel/index.js",
    "core/kernel/bootstrap/syscall.boot.js"
  ];

  const hits=[];

  for(const file of scanAll("core/kernel")){
    if(isIgnored(file)) continue;

    const txt=fs.readFileSync(file,"utf8");

    if(
      txt.includes("REMOVED_ILLEGAL_INSTANTIATION") &&
      !allowed.some(a=>file.endsWith(a))
    ){
      hits.push(file);
    }
  }

  if(hits.length){
    console.error("🚨 SYSCALLGATE MULTI-INSTANCE VIOLATION");
    console.error(hits.join("\n"));
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
