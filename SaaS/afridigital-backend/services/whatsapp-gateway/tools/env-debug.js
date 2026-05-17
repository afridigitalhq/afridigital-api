module.exports=(req,res)=>{
  res.json({
    token: !!process.env.WHATSAPP_TOKEN,
    phone: !!process.env.WHATSAPP_PHONE_ID,
    node_env: process.env.NODE_ENV || 'none'
  });
};
