import express from "express";
import AfriAIChannelGateway from "../../../modules/afriai/channels/AfriAIChannelGateway.js";

const router = express.Router();

router.post("/ask", async (req,res)=>{

  try {

    const {
      sessionId="landing",
      message=""
    } = req.body || {};

    const data = await AfriAIChannelGateway.receive(
      "Web",
      message
    );

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
