const http=require('http');
const socketio=require('socket.io');
const express=require('express');

function startVisualEngine(bus){

  const app=express();
  const server=http.createServer(app);
  const io=new socketio.Server(server);

  app.get('/',(_,res)=>{
    res.send('FLOWGRAPH VISUAL ENGINE ACTIVE');
  });

  if(global.__VISUAL_ENGINE_RUNNING__) return;
  global.__VISUAL_ENGINE_RUNNING__=true;

  const original=bus.emit.bind(bus);

  bus.emit=function(event,payload){
    io.emit('flowgraph:event',{
      event,
      payload,
      time:Date.now()
    });

    return original(event,payload);
  };

  io.on('connection',socket=>{
    socket.emit('boot',{status:'live'});
  });

  server.listen(5050,()=>{
    console.log('🚀 VISUAL ENGINE READY http://localhost:5050');
  });

}

module.exports={startVisualEngine};
