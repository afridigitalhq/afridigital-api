export default function metaDebugRoute(app){

  app.get("/api/afriwhatsapp/meta-health", async (req,res)=>{

    try{

      const response = await fetch(
        "https://graph.facebook.com/v19.0/me",
        {
          headers:{
            Authorization:
              `Bearer ${process.env.META_ACCESS_TOKEN}`
          }
        }
      );

      const data = await response.json();

      res.json({
        provider:"MetaWhatsApp",
        tokenStatus:response.ok ? "VALID":"INVALID",
        httpStatus:response.status,
        response:data,
        phoneNumberId:
          process.env.META_PHONE_NUMBER_ID ? "SET":"NOT_SET"
      });

    }catch(error){

      res.status(500).json({
        provider:"MetaWhatsApp",
        tokenStatus:"ERROR",
        message:error.message
      });

    }

  });

}
