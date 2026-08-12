import AfriAIEcosystemEntitlementRegistry from "./AfriAIEcosystemEntitlementRegistry.js";

const AfriAIEcosystemCatalogBootstrap={
  initialize(){
    AfriAIEcosystemEntitlementRegistry.register("AfriDebug",{
      free:{
        benefits:["Basic diagnosis"],
        capabilities:["diagnosis"]
      },
      starter:{
        benefits:["Extended diagnosis","Investigation access"],
        capabilities:["diagnosis","investigation"]
      },
      pro:{
        benefits:["Advanced investigation","Patch verification"],
        capabilities:["diagnosis","investigation","patching","verification"]
      },
      enterprise:{
        benefits:["Custom debugging workflows","Custom integrations"],
        capabilities:["diagnosis","investigation","patching","verification","custom"]
      }
    });
    return AfriAIEcosystemEntitlementRegistry.list();
  }
};

export default AfriAIEcosystemCatalogBootstrap;
