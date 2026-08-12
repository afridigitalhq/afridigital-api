import fs from "fs";
import path from "path";

const file =
"modules/afridesign/.data/afribuild-creator-intelligence.json";


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


const AfriBuildCreatorIntelligenceRegistry={


 build(profile={}){

  const records=load();


  const intelligence={

   id:
    "creator_intel_"+Date.now(),

   creatorId:
    profile.creatorId || null,

   assets:
    profile.assets || [],

   usage:{
    total:
     profile.usageCount || 0
   },

   reputation:{
    score:
     profile.reputation || 0
   },

   rewards:{
    points:
     profile.rewardPoints || 0,
    currency:"AfriCoin"
   },

   capabilities:
    profile.capabilities || [],

   createdAt:
    new Date().toISOString()

  };


  records.push(intelligence);

  save(records);


  return intelligence;

 },


 list(){

  return load();

 }


};


export default AfriBuildCreatorIntelligenceRegistry;
