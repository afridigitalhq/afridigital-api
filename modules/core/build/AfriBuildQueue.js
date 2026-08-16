import fs from "fs";
import path from "path";

const memory =
 path.resolve("modules/core/.data/afribuild-build-queue.json");

const AfriBuildQueue = {

 enqueue(request={}){

  const jobs =
   JSON.parse(fs.readFileSync(memory,"utf-8"));

  const job={
   jobId:"queue_"+Date.now(),
   userId:request.userId || null,
   product:request.product || "AfriBuild",
   appName:request.appName || "afribuild-app",
   targetPlatform:request.targetPlatform || "WEB",
   buildType:request.buildType || "WEBVIEW",
   status:"BUILD_QUEUED",
   createdAt:new Date().toISOString()
  };

  jobs.push(job);

  fs.writeFileSync(
   memory,
   JSON.stringify(jobs,null,2)
  );

  return job;

 }

};

export default AfriBuildQueue;
