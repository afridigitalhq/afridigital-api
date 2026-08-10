const AfriDebugRepairPlanValidator = {

  validate(plan = {}){

    const checks = {
      plan:
        !!plan.planId,

      recommendation:
        !!plan.recommendation,

      evidenceTrace:
        !!plan.evidenceTrace,

      approvalContext:
        !!plan.approvalContext
    };

    const valid =
      Object.values(checks)
      .every(Boolean);

    return {

      validationId:
        "VALIDATION-" + Date.now(),

      checks,

      status:
        valid
          ? "VALID"
          : "INVALID",

      executionAllowed:
        false,

      approvalRequired:true,

      createdAt:
        Date.now()

    };

  },

  health(){

    return {
      service:"AfriDebugRepairPlanValidator",
      status:"healthy"
    };

  }

};

export default AfriDebugRepairPlanValidator;
