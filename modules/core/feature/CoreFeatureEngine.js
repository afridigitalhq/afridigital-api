const CoreFeatureEngine={
 enabled(feature,context={}){
  return {
   feature,
   context,
   enabled:false,
   checkedAt:new Date().toISOString()
  };
 }
};

export default CoreFeatureEngine;
