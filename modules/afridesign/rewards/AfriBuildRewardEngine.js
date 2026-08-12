import fs from "fs";
import path from "path";

const file =
"modules/afridesign/.data/afribuild-rewards.json";


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


const AfriBuildRewardEngine={


 calculate(data={}){

  const usage =
   data.usageCount || 0;

  const quality =
   data.qualityScore || 0;


  const points =
   (usage * 10) +
   quality;


  const reward={

   rewardId:
    "reward_"+Date.now(),

   creatorId:
    data.creatorId || null,

   assetId:
    data.assetId || null,

   metrics:{
    usageCount:usage,
    qualityScore:quality
   },

   rewards:{
    points,
    currency:"AfriCoin"
   },

   status:"CALCULATED",

   createdAt:
    new Date().toISOString()

  };


  const rewards=load();

  rewards.push(reward);

  save(rewards);


  return reward;

 },


 list(){

  return load();

 }

};


export default AfriBuildRewardEngine;
