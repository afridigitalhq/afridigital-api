import fs from "fs";

const file="modules/core/.data/afri-workshop-previews.json";

function load(){
 if(!fs.existsSync(file)){
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const AfriWorkshopPreviewEngine={

 create(request={}){

  const previews=load();

  const preview={
   previewId:"preview_"+Date.now(),
   artifactId:request.artifactId || null,
   jobId:request.jobId || null,
   userId:request.userId || null,
   product:request.product || "AfriBuild",
   appName:request.appName || "UntitledApp",
   environment:"PRIVATE_WORKSHOP",
   aiAdjustment:{
    enabled:true,
    changes:[],
    status:"READY"
   },
   status:"PREVIEW_READY",
   createdAt:new Date().toISOString()
  };

  previews.push(preview);

  save(previews);

  return preview;

 },

 list(){
  return load();
 }

};

export default AfriWorkshopPreviewEngine;
