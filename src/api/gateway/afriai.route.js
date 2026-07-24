import express from "express";

const router = express.Router();

const sessions = new Map();

router.post("/ask",(req,res)=>{

  const {sessionId="landing",message=""}=req.body||{};

  if(!sessions.has(sessionId)){
    sessions.set(sessionId,{messages:[]});
  }

  const session=sessions.get(sessionId);

  session.messages.push({
    role:"user",
    message
  });

  const reply=`AfriAI received: ${message}`;

  session.messages.push({
    role:"assistant",
    message:reply
  });

  res.json({
    ok:true,
    data:{
      sessionId,
      reply,
      contextSize:session.messages.length
    }
  });

});

export default router;
