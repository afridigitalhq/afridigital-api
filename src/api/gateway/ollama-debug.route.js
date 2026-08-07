export default function ollamaDebugRoute(app){

  app.get("/api/afriai/ollama-debug",(req,res)=>{

    res.json({
      provider:"ollama",
      environment:{
        OLLAMA_URL:Boolean(process.env.OLLAMA_URL),
        OLLAMA_MODEL:process.env.OLLAMA_MODEL || null,
        OLLAMA_API_KEY:process.env.OLLAMA_API_KEY ? "SET" : "NOT_SET"
      },
      timestamp:new Date().toISOString()
    });

  });

}
