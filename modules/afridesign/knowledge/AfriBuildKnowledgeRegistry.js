import fs from "fs";
import path from "path";

const file =
 "modules/afridesign/.data/afribuild-knowledge.json";

const ensure = () => {

 const dir = path.dirname(file);

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

const load = () => {
 ensure();
 return JSON.parse(
  fs.readFileSync(file,"utf8")
 );
};

const save = (data) => {
 ensure();
 fs.writeFileSync(
  file,
  JSON.stringify(data,null,2)
 );
};


const AfriBuildKnowledgeRegistry = {

 remember(build={}){

  const builds = load();

  const record = {
   id:`knowledge_${Date.now()}`,
   type:build.type || "unknown",
   features:build.features || [],
   stack:build.stack || [],
   artifact:build.artifact || null,
   createdAt:new Date().toISOString()
  };

  builds.push(record);

  save(builds);

  return record;

 },

 search(type){

  return load().filter(
   item=>item.type===type
  );

 },

 recall(query={}){

  const builds = load();

  return builds.filter(item=>{

   const typeMatch =
    !query.type ||
    item.type===query.type;

   const featureMatch =
    !query.features ||
    query.features.every(
     feature=>item.features.includes(feature)
    );

   return typeMatch && featureMatch;

  });

 },

 list(){

  return load();

 }

};

export default AfriBuildKnowledgeRegistry;
