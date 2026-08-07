import AfriAIService from "../services/AfriAIService";
import AfriAIContextBuilder from "../context/AfriAIContextBuilder";

const AfriAIRuntime = {

  async ask(message){

    const context =
      AfriAIContextBuilder.build();

    return await AfriAIService.ask(
      message,
      context
    );

  }

};

export default AfriAIRuntime;
