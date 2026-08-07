import AfriWhatsAppRuntime from "../../../modules/afriwhatsapp/runtime/AfriWhatsAppRuntime.js";

export default function afriWhatsAppTestRoute(app){

  app.get("/api/afriwhatsapp/test", async (req,res)=>{

    const result =
      await AfriWhatsAppRuntime.receive({
        from:"debug-test",
        message:"Explain AfriCommerce in one sentence.",
        channel:"AfriWhatsApp"
      });

    res.json({
      certification:"AFRIWHATSAPP_AI_PIPELINE",
      status:"COMPLETED",
      result
    });

  });

}
