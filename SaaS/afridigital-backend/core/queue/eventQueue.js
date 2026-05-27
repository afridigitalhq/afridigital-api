const fs = require("fs");
const path = "logs/queue/eventQueue.json";

function load(){
  try { return JSON.parse(fs.readFileSync(path,"utf8") || "[]"); }
  catch { return []; }
}

function save(q){
  try { fs.writeFileSync(path, JSON.stringify(q,null,2)); } catch {}
}

function push(e){
  if(!e || !e.type) return;
  const q = load();
  q.push({ ...e, retries:0, timestamp:Date.now() });
  save(q);
}

function pop(){
  const q = load();
  const e = q.shift();
  save(q);
  return e || null;
}

function requeue(e){
  if(!e) return;
  const q = load();
  q.push({ ...e, retries:(e.retries||0)+1 });
  save(q);
}

module.exports = { push, pop, requeue };
