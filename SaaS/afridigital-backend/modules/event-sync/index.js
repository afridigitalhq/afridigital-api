const stream=require('../memory-stream');

function emit(event){
stream.write(event);
}

module.exports={emit};