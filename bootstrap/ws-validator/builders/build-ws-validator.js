const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"ws-validator.js"),`
const registry=require("../../ws-integration/output/ws-registry");

function validate(){

  const services=registry.list();

  const names=new Set();
  const duplicate=[];

  for(const s of services){
    if(names.has(s.name)) duplicate.push(s.name);
    names.add(s.name);
  }

  return{
    ok:duplicate.length===0,
    services:services.length,
    duplicates:duplicate,
    registered:services
  };
}

module.exports={validate};
`);

console.log("🟢 WS VALIDATOR BUILT");
console.log("📦 OUTPUT:",OUT);
