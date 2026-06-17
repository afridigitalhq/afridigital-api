module.exports = (req,res,next)=>{
  res.setHeader('X-AfriCore','SecureRuntimeV1');
  next();
};
