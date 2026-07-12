
const { registerService } = require("./ws-registrar");

function bootstrapAfriAI(handler){
    return registerService("afriai.ws",handler);
}

module.exports={
    bootstrapAfriAI
};
