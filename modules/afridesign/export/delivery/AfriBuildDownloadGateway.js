const AfriBuildDownloadGateway={

 create(request={}){

  return {
   gatewayId:"gateway_"+Date.now(),
   apkId:request.apkId || null,
   artifactId:request.artifactId || null,
   file:request.file || null,

   access:{
    type:"SECURE_DOWNLOAD",
    token:"token_"+Date.now(),
    expiresIn:"24h"
   },

   status:"DOWNLOAD_LINK_CREATED",

   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildDownloadGateway;
