import fs from "fs";
import path from "path";

const file =
 "modules/afridesign/.data/afribuild-creators.json";


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
 return JSON.parse(fs.readFileSync(file,"utf8"));
};


const save=data=>{
 ensure();
 fs.writeFileSync(file,JSON.stringify(data,null,2));
};


const AfriBuildCreatorRegistry={


 register(creator={}){

  const creators=load();

  const record={

   id:
    "creator_"+Date.now(),

   name:
    creator.name || "unknown",

   role:
    creator.role || "developer",

   rewards:0,

   createdAt:
    new Date().toISOString()

  };

  creators.push(record);

  save(creators);

  return record;

 },


 list(){

  return load();

 }

};


export default AfriBuildCreatorRegistry;
