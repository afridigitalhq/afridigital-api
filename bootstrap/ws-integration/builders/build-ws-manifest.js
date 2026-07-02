const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"ws-manifest.js"),`
function createManifest(services=[]){
    return services.map(service=>({
        id:service.name,
        enabled:true,
        handler:service.handler
    }));
}

module.exports={
    createManifest
};
`);

console.log("🟢 WS MANIFEST BUILT");
console.log("📦 OUTPUT:",OUT);
