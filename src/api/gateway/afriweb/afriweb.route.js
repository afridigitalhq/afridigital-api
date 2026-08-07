import AfriWebAIRoute from "../../../../modules/afriweb/routes/AfriWebAIRoute.js";

export default function afriWebRoute(app){

  app.get("/api/afriweb/test", async (req,res)=>{

    const result =
      await AfriWebAIRoute.handle({
        message:
          "Explain AfriCommerce in one sentence."
      });

    res.json({
      certification:"AFRIWEB_AI_PIPELINE",
      status:"COMPLETED",
      result
    });

  });

}
