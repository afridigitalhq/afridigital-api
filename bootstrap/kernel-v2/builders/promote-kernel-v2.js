const fs=require("fs");
const path=require("path");

const SRC="core/kernel-v2";
const DST="core/kernel";
const BACKUP="bootstrap/kernel-v2/backup-live";

fs.mkdirSync(BACKUP,{recursive:true});

const files=[
  "runtime-core.js",
  "syscallgate.js",
  "createKernel.js"
];

console.log("🧠 AFRIKERNEL V2 PROMOTION");
console.log("============================");

for(const file of files){

  const src=path.join(SRC,file);
  const dst=path.join(DST,file);

  if(!fs.existsSync(src)){
    throw new Error("Missing staged file: "+src);
  }

  if(fs.existsSync(dst)){
    fs.copyFileSync(dst,path.join(BACKUP,file));
    console.log("💾 Backed up:",file);
  }

  fs.copyFileSync(src,dst);
  console.log("✅ Promoted:",file);

}

console.log("============================");
console.log("🟢 PROMOTION COMPLETE");
console.log("⚠️ Legacy index.js has NOT been replaced yet.");
