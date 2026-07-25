import express from "express";
import AfriAIService from "../../afriai/services/AfriAIService.js";

const router = express.Router();

router.post("/ask",(req,res)=>{

  const { sessionId="landing", message="" } = req.body || {};

  const data = AfriAIService({
    sessionId,
    message
  });

  res.json({
    ok:true,
    data
  });

});

export default router;
