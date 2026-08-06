import fs from "node:fs";

const required=[
  "package.json",
  "server.js",
  "src/bootstrap/index.js",
  "modules"
];

export function validate(){
  console.log("\n🔍 Bootstrap Validation\n");
  let ok=true;

  for(const file of required){
    if(fs.existsSync(file)){
      console.log(`✅ ${file}`);
    }else{
      console.log(`❌ ${file}`);
      ok=false;
    }
  }

  console.log("\n--------------------------------");
  console.log(ok?"🟢 Bootstrap Validation PASSED":"🔴 Bootstrap Validation FAILED");
  console.log("--------------------------------");

  return ok;
}
