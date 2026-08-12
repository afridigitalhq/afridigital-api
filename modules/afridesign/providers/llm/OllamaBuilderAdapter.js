import AfriAIProviderRegistry from "../../../afriai/providers/AfriAIProviderRegistry.js";
import AfriBuildBuildIntelligence from "../../intelligence/AfriBuildBuildIntelligence.js";
import "../../../afriai/providers/bootstrap.js";

const OllamaBuilderAdapter = {

 name:"ollama-builder",

 capabilities:[
  "generate",
  "preview"
 ],

 async generate(request={}){

  const ollama =
   AfriAIProviderRegistry.get("ollama");

  if(!ollama){
   return {
    provider:this.name,
    status:"FAILED",
    reason:"OLLAMA_PROVIDER_NOT_AVAILABLE"
   };
  }


  const intelligence =
   AfriBuildBuildIntelligence.analyze({
    type:"UI",
    buildType:request.type || "web_app",
    prompt:request.prompt
   });


  const prompt = `
You are AfriBuild, an autonomous application builder.

Build:
${request.type || "web_app"}

User request:
${request.prompt || ""}

Use ecosystem intelligence:

Previous successful builds:
${JSON.stringify(intelligence.previousBuilds)}

Recommended creators:
${JSON.stringify(intelligence.recommendations)}

Generate:
- application structure
- components
- styling approach
- required files
- technical stack

Make the UI modern, scalable and mobile friendly.
`;


  const response =
   await ollama.generate(prompt);


  return {
   provider:"AfriDigital",
   engine:"AfriBuild",
   status:"GENERATED",
   output:response
  };

 }

};

export default OllamaBuilderAdapter;
