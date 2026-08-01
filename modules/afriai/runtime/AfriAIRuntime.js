import AfriAIRuntimeOrchestrator from "./orchestrator/AfriAIRuntimeOrchestrator.js";
import AfriAIExecutionRuntime from "./execution/AfriAIExecutionRuntime.js";
import AfriAIProviderRegistry from "../providers/AfriAIProviderRegistry.js";

const AfriAIRuntime={

  async ask(message="",context={}){

    const orchestration=
      AfriAIRuntimeOrchestrator.run(
        message,
        context
      );

    const execution=
      AfriAIExecutionRuntime.execute(
        orchestration
      );

    const provider =
      AfriAIProviderRegistry.get("ollama");

    const aiResponse =
      provider
        ? await provider.generate(message)
        : "";

    return{
      runtime:"AfriAIRuntime",
      message,
      orchestration,
      execution,
      reply:
        aiResponse ||
        orchestration.knowledge?.knowledge ||
        orchestration.knowledge?.response ||
        orchestration.decision?.reason ||
        orchestration.execution?.response ||
        "I am processing your request through the AfriDigital intelligence layer.",
      status:"READY"
    };

  }

};

export default AfriAIRuntime;
