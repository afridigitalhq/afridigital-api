const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"ws-runtime-loader.js"),`
const registry=require("../../ws-integration/output/ws-registry");

function loadRuntime(){

  return{
    loaded:true,
    services:registry.list()
  };

}

module.exports={loadRuntime};
`);

console.log("🟢 WS RUNTIME LOADER BUILT");
console.log("📦 OUTPUT:",OUT);
