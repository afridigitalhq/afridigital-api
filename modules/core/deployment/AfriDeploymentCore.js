import fs from "fs";

const file="modules/core/.data/afri-deployments.json";

function load(){
 if(!fs.existsSync(file)){
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const AfriDeploymentCore={

 publish(request={}){

  const deployments=load();

  const deployment={
   deploymentId:"deploy_"+Date.now(),
   previewId:request.previewId || null,
   artifactId:request.artifactId || null,
   userId:request.userId || null,
   product:request.product || "AfriBuild",
   appName:request.appName || "UntitledApp",
   deploymentType:request.type || "WEBVIEW",
   environment:"PUBLIC",
   url:"https://apps.afridigital.app/"+Date.now(),
   status:"DEPLOYED",
   createdAt:new Date().toISOString()
  };

  deployments.push(deployment);

  save(deployments);

  return deployment;

 },

 list(){
  return load();
 }

};

export default AfriDeploymentCore;
