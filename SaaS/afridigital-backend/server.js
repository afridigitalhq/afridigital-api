const express=require('express');
const app=express();

app.use(express.json());

// CORE HEALTH
app.get('/health',(req,res)=>res.json({ok:true}));

// MOUNT WHATSAPP GATEWAY
const whatsappGateway=require('./services/whatsapp-gateway/server');
app.use('/whatsapp',whatsappGateway);

// START
const PORT=process.env.PORT||3000;
app.listen(PORT,'0.0.0.0',()=>{
  console.log('🚀 AFRIAI RUNNING ON PORT',PORT);
});

module.exports=app;
