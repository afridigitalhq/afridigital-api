import fs from "fs";
import path from "path";

const file="modules/core/.data/afri-product-plan-sandbox.json";

function load(){

 if(!fs.existsSync(file)){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,"[]");
 }

 return JSON.parse(fs.readFileSync(file));

}


const AfriProductPlanSandbox={

 create(config={}){

  const records=load();

  const sandbox={
   sandboxId:"plan_sandbox_"+Date.now(),
   product:config.product || null,
   environment:"SANDBOX",
   plans:config.plans || {},
   status:"CREATED",
   createdAt:new Date().toISOString()
  };

  records.push(sandbox);

  fs.writeFileSync(
   file,
   JSON.stringify(records,null,2)
  );

  return sandbox;

 }

};

export default AfriProductPlanSandbox;
