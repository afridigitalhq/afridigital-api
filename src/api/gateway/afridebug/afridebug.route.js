import AfriDebugController from "../../../../modules/afridev/products/afridebug/api/AfriDebugController.js";
import AfriAIDebugExplainer from "../../../../modules/afriai/integrations/AfriAIDebugExplainer.js";

export default function afriDebugRoute(app){

  app.get("/api/afridebug/health",(req,res)=>{
    res.json({
      service:"AfriDebug",
      status:"READY"
    });
  });


  app.post("/api/afridebug/diagnose",async (req,res)=>{

    const {
      repository
    } = req.body || {};

    const result =
      AfriDebugController.investigate(
        repository
      );

    const explanation =
      await AfriAIDebugExplainer.explain(result);

    res.json({
      ok:true,
      result,
      explanation
    });

  });

}
