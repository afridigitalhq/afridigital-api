const fs=require("fs");
const path=require("path");

const OUT=path.join(__dirname,"../output");

fs.writeFileSync(path.join(OUT,"ws-discovery.js"),`
const { registerMany } = require("./ws-registrar");

function discover(services=[]){
    return registerMany(
        services.map(service=>({
            name:service.name,
            handler:service.handler
        }))
    );
}

module.exports={
    discover
};
`);

console.log("🟢 WS DISCOVERY BUILT");
console.log("📦 OUTPUT:",OUT);
