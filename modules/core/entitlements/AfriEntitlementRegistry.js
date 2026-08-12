import fs from "fs";

const registryFile="modules/core/.data/afri-entitlement-registry.json";

function load(){
 if(!fs.existsSync(registryFile)) return [];
 return JSON.parse(fs.readFileSync(registryFile));
}

function save(data){
 fs.writeFileSync(
  registryFile,
  JSON.stringify(data,null,2)
 );
}

const AfriEntitlementRegistry={

 register(data={}){

  const registry=load();

  const existing=registry.find(
   x=>x.userId===data.userId &&
      x.product===data.product
  );

  if(existing){
   return this.update(data);
  }

  const record={
   entitlementId:"entitlement_"+Date.now(),
   userId:data.userId,
   product:data.product,
   plan:data.plan,
   grants:data.grants,
   previous:null,
   status:"ACTIVE",
   createdAt:new Date().toISOString()
  };

  registry.push(record);
  save(registry);

  return record;
 },

 update(data={}){

  const registry=load();

  const item=registry.find(
   x=>x.userId===data.userId &&
      x.product===data.product
  );

  if(!item){
   return this.register(data);
  }

  item.previous=item.grants;
  item.plan=data.plan;
  item.grants=data.grants;
  item.updatedAt=new Date().toISOString();

  save(registry);

  return item;
 },

 resolve(userId,product){

  const registry=load();

  return registry.find(
   x=>x.userId===userId &&
      x.product===product
  ) || null;

 }

};

export default AfriEntitlementRegistry;
