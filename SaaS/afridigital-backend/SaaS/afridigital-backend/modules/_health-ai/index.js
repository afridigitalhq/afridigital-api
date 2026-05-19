const fs=require('fs');

function report(){
return {
time:Date.now(),
status:'healthy',
modules:fs.readdirSync('./modules')
};
}

module.exports={report};