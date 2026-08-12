import fs from "fs";
import path from "path";


const file =
"modules/afridesign/.data/afribuild-marketplace.json";


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


const AfriBuildAssetMarketplace={


 publish(asset={},validation={}){

  if(validation.status!=="APPROVED"){

   return {
    status:"REJECTED",
    reason:"ASSET_NOT_APPROVED"
   };

  }


  const marketplace=load();


  const listing={

   listingId:
    "listing_"+Date.now(),

   assetId:
    asset.id,

   name:
    asset.name,

   category:
    asset.category,

   creatorId:
    asset.metadata?.creatorId || null,

   usageCount:0,

   status:"PUBLISHED",

   createdAt:
    new Date().toISOString()

  };


  marketplace.push(listing);

  save(marketplace);


  return listing;

 },


 list(){

  return load();

 }


};


export default AfriBuildAssetMarketplace;
