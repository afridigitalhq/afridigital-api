const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"ws-registrar.js"),`
const { integrate } = require("./ws-integration");

function registerService(name,handler){
    return integrate(name,handler);
}

function registerMany(services=[]){
    return services.map(({name,handler})=>registerService(name,handler));
}

module.exports={
    registerService,
    registerMany
};
`);

console.log("🟢 WS REGISTRAR BUILT");
console.log("📦 OUTPUT:",OUT);
