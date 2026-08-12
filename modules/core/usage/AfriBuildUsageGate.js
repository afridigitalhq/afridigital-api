const AfriBuildUsageGate={

 check(request={}){

  const allowed=request.used < request.limit;

  return {
   feature:request.feature || "BUILD",
   used:request.used || 0,
   limit:request.limit || 0,
   allowed,
   billingRequired:!allowed,
   status:allowed ? "ALLOWED":"PAYG_REQUIRED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildUsageGate;
