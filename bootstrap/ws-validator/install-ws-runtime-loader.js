const { loadRuntime } = require("./output/ws-runtime-loader");

const report = loadRuntime();

console.log("🧠 WS RUNTIME REPORT");
console.log(JSON.stringify(report,null,2));
