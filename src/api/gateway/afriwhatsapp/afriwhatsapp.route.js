import AfriWhatsAppWebhookHandler from "../../../../modules/afriwhatsapp/provider-runtime/AfriWhatsAppWebhookHandler.js";

export default function afriWhatsAppRoute(app){

  app.use("/api/afriwhatsapp", (req,res,next)=>{
    if(!req.body){
      req.body={};
    }
    next();
  });

  app.post("/api/afriwhatsapp/webhook",(req,res)=>{

    const result =
      AfriWhatsAppWebhookHandler.handle(
        req.body
      );

    res.json({
      status:"RECEIVED",
      result
    });

  });

}
