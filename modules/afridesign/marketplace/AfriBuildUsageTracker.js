import fs from "fs";
import path from "path";


const file =
"modules/afridesign/.data/afribuild-asset-usage.json";


const ensure=()=>{

 const dir=path.dirname(file);

 if(!fs.existsSync(dir)){
  fs.mkdirSync(dir,{recursive:true});
 }

 if(!fs.existsSync(file)){
  fs.writeFileSync(file,JSON.stringify([],null,2));
 }

};


const load=()=>{

 ensure();

 return JSON.parse(
  fs.readFileSync(file,"utf8")
 );

};


const save=data=>{

 ensure();

 fs.writeFileSync(
  file,
  JSON.stringify(data,null,2)
 );

};


const AfriBuildUsageTracker={


 record(data={}){

  const usage=load();


  let record =
   usage.find(
    item=>item.assetId===data.assetId
   );


  if(!record){

   record={

    assetId:data.assetId,

    creatorId:data.creatorId || null,

    applications:[],

    usageCount:0

   };

   usage.push(record);

  }


  record.usageCount++;


  if(data.application){

   record.applications.push({

    projectId:data.application,

    timestamp:
     new Date().toISOString()

   });

  }


  save(usage);


  return record;

 },


 list(){

  return load();

 }


};


export default AfriBuildUsageTracker;
