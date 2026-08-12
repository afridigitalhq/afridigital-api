import AfriEntitlementRegistry from "../entitlements/AfriEntitlementRegistry.js";

const AfriProductAccessPolicy={

 check(request={}){

  const entitlement=
   AfriEntitlementRegistry.resolve(
    request.userId,
    request.product
   );

  const plan=entitlement?.plan || "free";

  const permissions={
   free:{
    WEBVIEW:true,
    APK_EXPORT:false,
    AAB_EXPORT:false,
    TEAM_APPROVAL:false
   },
   starter:{
    WEBVIEW:true,
    APK_EXPORT:false,
    AAB_EXPORT:false,
    TEAM_APPROVAL:false
   },
   pro:{
    WEBVIEW:true,
    APK_EXPORT:true,
    AAB_EXPORT:false,
    TEAM_APPROVAL:false
   },
   business:{
    WEBVIEW:true,
    APK_EXPORT:true,
    AAB_EXPORT:true,
    TEAM_APPROVAL:false
   },
   enterprise:{
    WEBVIEW:true,
    APK_EXPORT:true,
    AAB_EXPORT:true,
    TEAM_APPROVAL:true
   }
  };

  return {
   userId:request.userId,
   product:request.product,
   plan,
   requested:request.feature || "WEBVIEW",
   access:
    permissions[plan]?.[request.feature]
     ? "GRANTED"
     : "DENIED",
   permissions:permissions[plan] || permissions.free,
   status:"POLICY_CHECKED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriProductAccessPolicy;
