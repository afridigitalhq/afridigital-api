import AfriDebugController from "../../../../modules/afridev/products/afridebug/api/AfriDebugController.js";

export default function afriDebugRoute(app){

  app.get("/api/afridebug/health",(req,res)=>{
    res.json({
      service:"AfriDebug",
      status:"READY"
    });
  });


  app.post("/api/afridebug/diagnose",(req,res)=>{

    const {
      repository
    } = req.body || {};

    const result =
      AfriDebugController.investigate(
        repository
      );

    res.json({
      ok:true,
      result
    });

  });

}
