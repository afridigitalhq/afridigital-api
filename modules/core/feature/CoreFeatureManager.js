const CoreFeatureManager={
 toggle(feature,status){
  return {feature,status,statusUpdatedAt:new Date().toISOString()};
 }
};

export default CoreFeatureManager;
