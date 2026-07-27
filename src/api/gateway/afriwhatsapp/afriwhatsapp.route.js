import AfriWhatsAppWebhookHandler from "../../../../modules/afriwhatsapp/provider-runtime/AfriWhatsAppWebhookHandler.js";

export default function afriWhatsAppRoute(app){

  // Meta webhook verification
  app.get("/api/afriwhatsapp/webhook",(req,res)=>{

    const mode =
      req.query["hub.mode"];

    const token =
      req.query["hub.verify_token"];

    const challenge =
      req.query["hub.challenge"];

    console.log("AfriWhatsApp verification check:", {
      mode,
      tokenReceived: Boolean(token),
      envTokenLoaded: Boolean(process.env.META_VERIFY_TOKEN)
    });

    if(
      mode === "subscribe" &&
      token === process.env.META_VERIFY_TOKEN
    ){

      return res.status(200).send(
        challenge
      );

    }

    return res.sendStatus(403);

  });


  // Meta incoming messages
  app.post("/api/afriwhatsapp/webhook", async (req,res)=>{

    const result =
      await AfriWhatsAppWebhookHandler.handle(
        req.body
      );

    res.status(200).json({
      status:"RECEIVED",
      result
    });

  });

}
