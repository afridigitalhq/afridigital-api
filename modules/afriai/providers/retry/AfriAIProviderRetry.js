const AfriAIProviderRetry = {

 async execute(task, options={}){

  const attempts = options.attempts || 3;
  const delay = options.delay || 3000;

  let lastError;

  for(let i=1;i<=attempts;i++){

   try{

    const result = await task();

    return {
     status:"SUCCESS",
     attempts:i,
     result
    };

   }
   catch(error){

    lastError = error;

    if(i < attempts){
      await new Promise(r=>setTimeout(r,delay));
    }

   }

  }


  return {
   status:"FAILED",
   attempts,
   error:lastError?.message || "Provider failed"
  };

 }

};

export default AfriAIProviderRetry;
