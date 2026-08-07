import { AfriFixJobQueue } from "../src/runtime/queue/AfriFixJobQueue.js";
import { AfriFixScheduler } from "../src/runtime/scheduler/AfriFixScheduler.js";
import { AfriFixWorker } from "../src/runtime/workers/AfriFixWorker.js";

const q=new AfriFixJobQueue();
const s=new AfriFixScheduler();
const w=new AfriFixWorker();

const job=q.enqueue({module:"afridebug",action:"repair"});
console.log(job);
console.log(s.schedule(job));
console.log(w.execute(job));
