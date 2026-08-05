const CoreFeatureRegistry={
 register(feature,config){
  return {feature,config,status:"REGISTERED"};
 }
};

export default CoreFeatureRegistry;
