import express from "express";
import AfriAIService from "../../afriai/services/AfriAIService.js";

const router = express.Router();

router.post("/ask", async (req,res)=>{

  try {

    const {
      sessionId="landing",
      message=""
    } = req.body || {};

    const data = await AfriAIService({
      sessionId,
      message
    });

    res.json({
      ok:true,
      data
    });

  } catch(error){

    res.status(500).json({
      ok:false,
      error:"AfriAI service unavailable"
    });

  }

});

export default router;
