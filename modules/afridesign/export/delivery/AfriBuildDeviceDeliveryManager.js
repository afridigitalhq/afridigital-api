const AfriBuildDeviceDeliveryManager={

 deliver(request={}){

  return {
   deliveryId:"device_delivery_"+Date.now(),
   gatewayId:request.gatewayId || null,
   application:request.application || null,
   version:request.version || "1.0.0",

   device:{
    platform:request.platform || "android",
    target:"USER_DEVICE",
    installMethod:"APK_PACKAGE"
   },

   file:request.file || null,

   status:"READY_FOR_DEVICE_DOWNLOAD",

   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildDeviceDeliveryManager;
