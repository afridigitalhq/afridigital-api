const stream=require('../memory-stream');

const state={sessions:{}};

function commit(sessionId,message){
if(!state.sessions[sessionId]) state.sessions[sessionId]=[];

state.sessions[sessionId].push({message,time:Date.now()});
state.sessions[sessionId]=state.sessions[sessionId].slice(-100);

stream.write({sessionId,message});
}

function query(sessionId){
return state.sessions[sessionId]||[];
}

module.exports={commit,query,state};