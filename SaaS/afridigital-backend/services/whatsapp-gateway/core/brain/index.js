const core/brain/v2/afriBrainV2=require('./v5/core/brain/v2/afriBrainV2');

module.exports={
  processMessage:(req,res)=>core/brain/v2/afriBrainV2(req.body)
};
