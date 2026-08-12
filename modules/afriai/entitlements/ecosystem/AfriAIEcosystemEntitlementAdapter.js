import AfriAIEcosystemEntitlementRegistry from "./AfriAIEcosystemEntitlementRegistry.js";

const AfriAIEcosystemEntitlementAdapter={
  resolve({product="",plan="free",context={}}={}){
    const entitlement=AfriAIEcosystemEntitlementRegistry.resolve(product,plan);
    return{
      ...entitlement,
      source:"AfriAIEcosystemEntitlementRegistry",
      context
    };
  }
};

export default AfriAIEcosystemEntitlementAdapter;
