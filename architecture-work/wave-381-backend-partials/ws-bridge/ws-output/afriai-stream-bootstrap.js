
const { registerService } = require("./ws-registrar");

function bootstrapAfriAIStream(handler){
    return registerService("afriai.stream",handler);
}

module.exports={
    bootstrapAfriAIStream
};
