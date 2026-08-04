import AfriAIMultiChannelRuntime from "../multichannel/AfriAIMultiChannelRuntime.js";
import AfriAIResponseFormatter from "../response/AfriAIResponseFormatter.js";

const AfriAIExperienceOrchestrator={
run(channel="Web",message=""){
return{
channel:AfriAIMultiChannelRuntime.connect(channel),
response:AfriAIResponseFormatter.format(message),
status:"READY"
};
}
};

export default AfriAIExperienceOrchestrator;
