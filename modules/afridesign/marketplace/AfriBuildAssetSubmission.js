import AfriBuildAssetRegistry from "../assets/AfriBuildAssetRegistry.js";

const AfriBuildAssetSubmission={

 submit(request={}){

  const asset =
   AfriBuildAssetRegistry.register({

    name:request.name,

    type:request.type,

    category:request.category,

    tags:request.tags,

    source:"CREATOR",

    metadata:{
     creatorId:request.creatorId,
     version:"1.0.0"
    }

   });


  return {

   submissionId:
    "submission_"+Date.now(),

   asset,

   creatorId:
    request.creatorId,

   status:"SUBMITTED",

   createdAt:
    new Date().toISOString()

  };

 }

};

export default AfriBuildAssetSubmission;
