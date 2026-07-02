const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"ws-integration.js"),`
const registry=require("./ws-registry");

function integrate(name,handler){
    const ok=registry.register(name,handler);

    return{
        ok,
        name
    };
}

module.exports={
    integrate
};
`);

console.log("🟢 WS INTEGRATION BUILT");
console.log("📦 OUTPUT:",OUT);
