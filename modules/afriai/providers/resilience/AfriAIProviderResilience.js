const AFRIAI_PROVIDER_TIMEOUT_MS = Number(process.env.AFRIAI_PROVIDER_TIMEOUT_MS || 60000);

const AfriAIProviderResilience = {

  async execute(task, handler){

    try{

      const result = await Promise.race([
        handler(task),
        new Promise((_,reject)=>
          setTimeout(
            ()=>reject(new Error("AI_PROVIDER_TIMEOUT")),
            AFRIAI_PROVIDER_TIMEOUT_MS
          )
        )
      ]);

      return {
        status:"PROVIDER_SUCCESS",
        result
      };

    }catch(error){

      return {
        status:"PROVIDER_UNAVAILABLE",
        error:error.message,
        recommendation:"Preserve evidence and retry provider connection"
      };

    }

  }

};

export default AfriAIProviderResilience;
