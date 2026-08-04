import axios from "axios";

const AfriAIProviderHealth = {

  async check(provider){

    if(!provider){
      return false;
    }

    if(provider.name === "ollama"){

      try{

        const url =
          process.env.OLLAMA_URL?.replace(
            "/api/generate",
            ""
          ) || "http://127.0.0.1:11434";

        await axios.get(
          `${url}/api/tags`,
          {
            timeout:2000
          }
        );

        return true;

      }catch(error){

        return false;

      }

    }

    return true;

  }

};

export default AfriAIProviderHealth;
