const AfriAICapabilityRegistry={
  load(){
    return {
      education:{
        skill:"education",
        service:"AfriEducation",
        integration:"AfriAIEducationIntegration",
        modes:["explain","teach","lesson","quiz","solve","practice"],
        generationProfile:"extended"
      },
      commerce:{skill:"commerce",service:"AfriCommerce",generationProfile:"standard"},
      payments:{skill:"payments",service:"Payments",generationProfile:"standard"},
      opportunity:{skill:"opportunity",generationProfile:"standard"},
      support:{skill:"support",generationProfile:"dynamic"},
      build_app:{
        skill:"build_app",
        service:"AfriDesign",
        integration:"AfriAIAfriDesignBridge",
        generationProfile:"extended"
      },
      conversation:{skill:"conversation",generationProfile:"short"}
    };
  },
  resolve(intent="general"){
    const capabilities=this.load();
    return capabilities[intent] || {skill:"conversation",generationProfile:"short"};
  }
};
export default AfriAICapabilityRegistry;
