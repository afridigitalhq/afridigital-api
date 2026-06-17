export const initialize = async (req,res) => {
  res.json({status:'success', message:'Paystack initialize endpoint works'});
};
export const verify = async (req,res) => {
  const { reference } = req.params;
  res.json({status:'success', message:'Paystack verify endpoint works for reference ' + reference});
};
