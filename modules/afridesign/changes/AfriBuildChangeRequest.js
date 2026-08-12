const AfriBuildChangeRequest={

 create(request={}){

  return {
   id:"change_"+Date.now(),
   project:request.project || null,
   instruction:request.instruction || "",
   requestedBy:request.user || "user",
   status:"REQUESTED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildChangeRequest;
