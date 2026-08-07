export default function whatsappDebugRoute(app){

  app.get("/api/afriwhatsapp/debug",(req,res)=>{

    res.json({

      provider:"MetaWhatsApp",

      environment:{
        META_PHONE_NUMBER_ID:
          process.env.META_PHONE_NUMBER_ID ? "SET":"NOT_SET",

        META_ACCESS_TOKEN:
          process.env.META_ACCESS_TOKEN ? "SET":"NOT_SET",

        META_VERIFY_TOKEN:
          process.env.META_VERIFY_TOKEN ? "SET":"NOT_SET"
      },

      webhook:{
        verifyPath:"/api/afriwhatsapp/webhook",
        receivePath:"/api/afriwhatsapp/webhook"
      },

      timestamp:new Date().toISOString()

    });

  });

}
