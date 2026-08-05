import AfriDebugRuntime from "../../../../modules/platform/observability/debug/AfriDebugRuntime.js";
import AfriDebugDiagnosis from "../../../../modules/platform/observability/debug/AfriDebugDiagnosis.js";
import AfriDebugPatchPlanner from "../../../../modules/platform/observability/debug/AfriDebugPatchPlanner.js";

export default function afriDebugRoute(app){

  app.get("/api/afridebug/health",(req,res)=>{
    res.json({
      service:"AfriDebug",
      status:"READY",
      runtime:AfriDebugRuntime.health(
        "AfriDebug",
        "ONLINE"
      )
    });
  });


  app.post("/api/afridebug/diagnose",(req,res)=>{

    const {
      error,
      context={}
    } = req.body || {};

    const diagnosis =
      AfriDebugDiagnosis.analyze(
        error,
        context
      );

    const patch =
      AfriDebugPatchPlanner.create(
        diagnosis,
        context
      );

    res.json({
      ok:true,
      diagnosis,
      patch
    });

  });

}
