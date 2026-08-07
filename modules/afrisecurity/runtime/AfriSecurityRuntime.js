import AfriSecurityCoreAdapter from "../adapters/AfriSecurityCoreAdapter.js";

const AfriSecurityRuntime={
 inspect(target){

  const security=AfriSecurityCoreAdapter.inspect(target);

  return {
   component:"AfriSecurity Runtime",
   status:security.decision?.status==="SECURITY_APPROVED"
    ? "APPROVED"
    : "REVIEW_REQUIRED",
   security,
   inspectedAt:new Date().toISOString()
  };

 }
};

export default AfriSecurityRuntime;
