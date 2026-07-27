const AfriAIContracts = {

  request:{
    input:"UserRequest",
    output:"AIResponse"
  },

  rules:[
    "AfriAI orchestrates services only",
    "Business logic remains inside owning backend modules",
    "Channels consume AfriAI through APIs"
  ]

};

export default AfriAIContracts;
