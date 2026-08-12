import fs from "fs";

const file="modules/core/.data/afri-usage-history.json";

function load(){
 if(!fs.existsSync(file)){
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const CoreUsageHistory={

 record(data={}){

  const history=load();

  const entry={
   usageId:"usage_"+Date.now(),
   userId:data.userId,
   product:data.product,
   feature:data.feature,
   source:data.source,
   quantity:data.quantity || 1,
   status:"RECORDED",
   createdAt:new Date().toISOString()
  };

  history.push(entry);
  save(history);

  return entry;
 },

 list(){
  return load();
 }

};

export default CoreUsageHistory;
