
const { registerService } = require("./ws-registrar.cjs");

function bootstrapAfriAI(handler){
    return registerService("afriai.ws",handler);
}

module.exports={
    bootstrapAfriAI
};
