import fs from "fs";

const sandboxFile="modules/core/.data/afri-product-plan-sandbox.json";
const publishFile="modules/core/.data/afri-product-plans-published.json";

const AfriPlanPublisher={

 publish(request={}){

  const sandboxes=JSON.parse(
   fs.readFileSync(sandboxFile)
  );

  const sandbox=sandboxes.find(
   x=>x.product===request.product
  );

  if(!sandbox){
   return {
    status:"SANDBOX_NOT_FOUND"
   };
  }

  let published=[];

  if(fs.existsSync(publishFile)){
   published=JSON.parse(
    fs.readFileSync(publishFile)
   );
  }

  published=published.filter(
   x=>x.product!==request.product
  );

  const record={
   publishId:"publish_"+Date.now(),
   product:sandbox.product,
   plans:sandbox.plans,
   environment:"PRODUCTION",
   status:"PUBLISHED",
   publishedAt:new Date().toISOString()
  };

  published.push(record);

  fs.writeFileSync(
   publishFile,
   JSON.stringify(published,null,2)
  );

  return record;

 }

};

export default AfriPlanPublisher;
