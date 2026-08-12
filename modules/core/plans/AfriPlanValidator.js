const AfriPlanValidator={

 validate(plan={}){

  const requiredPlans=plan.requiredPlans || [
   "free",
   "starter",
   "pro"
  ];

  const checks={
   hasProduct:!!plan.product,
   hasPlans:!!plan.plans
  };

  requiredPlans.forEach(name=>{
   checks["has_"+name]=!!plan.plans?.[name];
  });

  const passed=Object.values(checks).every(Boolean);

  return {
   validationId:"plan_validation_"+Date.now(),
   product:plan.product || null,
   requiredPlans,
   checks,
   score:passed ? 100 : 0,
   status:passed ? "APPROVED":"FAILED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriPlanValidator;
