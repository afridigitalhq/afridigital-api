import fs from "fs";

const file="modules/core/.data/afri-product-plan-sandbox.json";

const AfriPlanSandboxUpdater={
  remove(product,plan,features=[]){

  const file="modules/core/.data/afri-product-plan-sandbox.json";
  const data=JSON.parse(fs.readFileSync(file));

  const target=data.find(x=>x.product===product);

  if(target && target.plans[plan]){
   features.forEach(f=>delete target.plans[plan][f]);
   target.updatedAt=new Date().toISOString();
  }

  fs.writeFileSync(file,JSON.stringify(data,null,2));

  return target;

 },

 update(request={}){

  const records=JSON.parse(fs.readFileSync(file));

  const sandbox=records.find(
   x=>x.product===request.product
  );

  if(!sandbox){
   return {
    status:"SANDBOX_NOT_FOUND"
   };
  }

  sandbox.plans[request.plan]={
   ...sandbox.plans[request.plan],
   ...request.changes
  };

  sandbox.updatedAt=new Date().toISOString();
  sandbox.status="UPDATED";

  fs.writeFileSync(
   file,
   JSON.stringify(records,null,2)
  );

  return sandbox;

 }

};

export default AfriPlanSandboxUpdater;
