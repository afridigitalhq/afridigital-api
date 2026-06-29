const fs=require("fs");
const path=require("path");

const SRC="bootstrap/kernel-v2/output";
const DST="core/kernel-v2";
const BACKUP="bootstrap/kernel-v2/backup";

fs.mkdirSync(BACKUP,{recursive:true});
fs.mkdirSync(DST,{recursive:true});

const files=[
  "runtime-core.js",
  "syscallgate.js",
  "createKernel.js"
];

console.log("🧠 AFRIKERNEL V2 INSTALL");
console.log("============================");

for(const file of files){
  const src=path.join(SRC,file);
  const dst=path.join(DST,file);

  if(!fs.existsSync(src)){
    throw new Error("Missing build artifact: "+src);
  }

  if(fs.existsSync(dst)){
    fs.copyFileSync(dst,path.join(BACKUP,file));
    console.log("💾 Backup:",file);
  }

  fs.copyFileSync(src,dst);
  console.log("✅ Installed:",file);
}

console.log("============================");
console.log("🟢 AFRIKERNEL V2 INSTALLED (STAGING)");
console.log("Production kernel has NOT been replaced.");
