const liveBrainV5=require('./v5/liveBrainV5');

module.exports={
  processMessage:(req,res)=>liveBrainV5(req.body)
};
