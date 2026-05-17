const express=require('express');
const app=express();

app.use(express.json());

app.get('/health',(req,res)=>res.json({ok:true}));

// WHATSAPP GATEWAY
const whatsappGateway=require('./services/whatsapp-gateway/server');
app.use('/whatsapp',whatsappGateway);

// TOOLS FIX (GLOBAL MOUNT INSIDE GATEWAY)
const envCheck=require('./services/whatsapp-gateway/tools/envCheck');
app.use('/whatsapp/tools',envCheck);

const PORT=process.env.PORT||3000;
app.listen(PORT,'0.0.0.0',()=>{
  console.log('🚀 AFRIAI RUNNING ON PORT',PORT);
});

module.exports=app;
