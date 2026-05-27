const fs = require("fs");
const path = "logs/queue/eventQueue.json";

function load(){
  try { return JSON.parse(fs.readFileSync(path,"utf8") || "[]"); }
  catch { return []; }
}

function save(q){
  try { fs.writeFileSync(path, JSON.stringify(q,null,2)); } catch {}
}

function push(event){
  if(!event || !event.type) return;

  const q = load();
  q.push({
    ...event,
    id: Math.random().toString(36).slice(2),
    retries:0,
    priority: event.priority || 1,
    ts: Date.now()
  });

  // priority sort (simple)
  q.sort((a,b)=>b.priority - a.priority);

  save(q);
}

function pop(){
  const q = load();
  const e = q.shift();
  save(q);
  return e || null;
}

function requeue(event){
  if(!event) return;
  const q = load();

  const retries = (event.retries || 0) + 1;
  const delay = Math.min(5000 * retries, 30000);

  setTimeout(()=>{
    q.push({...event, retries});
    save(q);
  }, delay);
}

module.exports = { push, pop, requeue };
