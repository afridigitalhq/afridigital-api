const AfriBuildAssetValidation={

 validate(asset={}){

  const checks={

   hasName:Boolean(asset.name),

   hasType:Boolean(asset.type),

   hasCategory:Boolean(asset.category),

   hasCreator:Boolean(
    asset.metadata?.creatorId
   )

  };


  const passed =
   Object.values(checks)
   .every(Boolean);


  return {

   validationId:
    "asset_validation_"+Date.now(),

   assetId:
    asset.id || null,

   checks,

   score:
    passed ? 100 : 50,

   status:
    passed ? "APPROVED":"REJECTED",

   createdAt:
    new Date().toISOString()

  };

 }

};

export default AfriBuildAssetValidation;
