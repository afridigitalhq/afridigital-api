import fs from "fs";
import path from "path";


const file =
 "modules/afridesign/.data/afribuild-assets.json";


const ensure=()=>{

 const dir=path.dirname(file);

 if(!fs.existsSync(dir)){
  fs.mkdirSync(dir,{recursive:true});
 }

 if(!fs.existsSync(file)){
  fs.writeFileSync(
   file,
   JSON.stringify([],null,2)
  );
 }

};


const load=()=>{

 ensure();

 return JSON.parse(
  fs.readFileSync(file,"utf8")
 );

};


const save=(data)=>{

 ensure();

 fs.writeFileSync(
  file,
  JSON.stringify(data,null,2)
 );

};



const AfriBuildAssetRegistry={


 register(asset={}){

  const assets=load();


  const item={

   id:
    "asset_"+Date.now(),

   name:
    asset.name || "unknown",

   type:
    asset.type || "image",

   category:
    asset.category || "general",

   tags:
    asset.tags || [],

   source:
    asset.source || "AfriBuild",

   metadata:
    asset.metadata || {},

   createdAt:
    new Date().toISOString()

  };


  assets.push(item);

  save(assets);


  return item;

 },


 search(query){

  return load().filter(asset=>

   asset.tags.includes(query) ||
   asset.category===query

  );

 },


 list(){

  return load();

 }


};


export default AfriBuildAssetRegistry;
