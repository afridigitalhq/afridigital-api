const AfriBuildChangePlanner={

 plan(request={}){

  const instruction =
   request.instruction || "";

  const changes=[];


  if(
   instruction.toLowerCase().includes("logo")
  ){

   changes.push({
    type:"ASSET_UPDATE",
    target:"logo",
    action:"REPLACE"
   });

  }


  if(
   instruction.toLowerCase().includes("name") ||
   instruction.toLowerCase().includes("brand")
  ){

   changes.push({
    type:"BRAND_UPDATE",
    target:"application_name",
    action:"MODIFY"
   });

  }


  return {

   changeId:
    "plan_"+Date.now(),

   project:
    request.project || null,

   instruction,

   changes,

   status:
    changes.length ?
    "PLANNED":
    "NO_CHANGES_DETECTED",

   createdAt:
    new Date().toISOString()

  };

 }

};

export default AfriBuildChangePlanner;
