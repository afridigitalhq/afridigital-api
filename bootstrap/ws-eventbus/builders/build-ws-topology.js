const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"ws-topology.js"),`
const registry=[];

function register(name,path){
    registry.push({
        name,
        path,
        timestamp:Date.now()
    });
}

function list(){
    return registry;
}

module.exports={
    register,
    list
};
`);

console.log("🟢 WS TOPOLOGY BUILT");
console.log("📦 OUTPUT:",OUT);
