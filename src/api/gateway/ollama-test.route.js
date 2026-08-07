import OllamaProvider from "../../modules/afriai/providers/OllamaProvider.js";

export default function ollamaTestRoute(app){

  app.get("/api/afriai/ollama-test", async(req,res)=>{

    const started = Date.now();

    try{

      const result =
        await OllamaProvider.generate(
          "Explain AfriCommerce in one sentence."
        );

      res.json({
        provider:"ollama",
        status: result ? "SUCCESS" : "EMPTY_RESPONSE",
        model: process.env.OLLAMA_MODEL || null,
        durationMs: Date.now() - started,
        result
      });

    }catch(error){

      res.status(500).json({
        provider:"ollama",
        status:"FAILED",
        error:error.message,
        durationMs: Date.now() - started
      });

    }

  });

}
