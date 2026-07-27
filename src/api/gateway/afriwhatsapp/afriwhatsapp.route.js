import AfriWhatsAppWebhookHandler from "../../../../modules/afriwhatsapp/provider-runtime/AfriWhatsAppWebhookHandler.js";

export default function afriWhatsAppRoute(app){

  app.post("/api/afriwhatsapp/webhook", async (req,res)=>{

    const result =
      await AfriWhatsAppWebhookHandler.handle(
        req.body
      );

    res.json({
      status:"RECEIVED",
      result
    });

  });

}
