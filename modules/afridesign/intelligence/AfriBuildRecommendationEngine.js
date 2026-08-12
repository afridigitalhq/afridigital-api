import fs from "fs";
import path from "path";

const file =
"modules/afridesign/.data/afribuild-creator-intelligence.json";


const load=()=>{

 if(!fs.existsSync(file)){
  return [];
 }

 return JSON.parse(
  fs.readFileSync(file,"utf8")
 );

};


const AfriBuildRecommendationEngine={


 recommend(request={}){

  const creators=load();


  const keyword =
   (request.type || "")
   .toLowerCase();


  const matches =
   creators.filter(item=>

    item.capabilities.some(
     capability =>
      capability.toLowerCase()
      .includes(keyword)
    )

   );


  return {

   query:request.type || "general",

   recommendedCreators:
    matches.map(item=>({
     creatorId:item.creatorId,
     reputation:item.reputation.score,
     assets:item.assets,
     capabilities:item.capabilities
    })),

   status:"RECOMMENDED",

   createdAt:
    new Date().toISOString()

  };

 }


};


export default AfriBuildRecommendationEngine;
