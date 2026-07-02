const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");
fs.mkdirSync(OUT,{recursive:true});

fs.writeFileSync(path.join(OUT,"ws-registry.js"),`
const registry=new Map();

function register(name,handler){
    if(registry.has(name)){
        return false;
    }
    registry.set(name,handler);
    return true;
}

function get(name){
    return registry.get(name);
}

function list(){
    return [...registry.keys()];
}

module.exports={
    register,
    get,
    list
};
`);

console.log("🟢 WS REGISTRY BUILT");
console.log("📦 OUTPUT:",OUT);
