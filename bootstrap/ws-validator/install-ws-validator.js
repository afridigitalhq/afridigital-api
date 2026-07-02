const fs=require("fs");

const file="bootstrap/ws-validator/output/ws-validator.js";

if(!fs.existsSync(file)){
  console.log("❌ Validator not found");
  process.exit(1);
}

const { validate }=require("./output/ws-validator");

const report=validate();

console.log("🧠 WS VALIDATION REPORT");
console.log(JSON.stringify(report,null,2));
