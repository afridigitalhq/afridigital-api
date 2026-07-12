
const { registerService } = require("./ws-registrar.cjs");

function bootstrapAfriAIStream(handler){
    return registerService("afriai.stream",handler);
}

module.exports={
    bootstrapAfriAIStream
};
