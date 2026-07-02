const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"ws-runtime.js"),`
const { createManifest } = require("./ws-manifest");
const { discover } = require("./ws-discovery");

function initializeRuntime(services=[]){
    const manifest=createManifest(services);
    const registered=discover(manifest);

    return{
        manifest,
        registered
    };
}

module.exports={
    initializeRuntime
};
`);

console.log("🟢 WS RUNTIME BUILT");
console.log("📦 OUTPUT:",OUT);
