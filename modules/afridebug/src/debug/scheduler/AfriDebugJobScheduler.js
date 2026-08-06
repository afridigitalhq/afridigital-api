import Queue from "../queue/AfriDebugQueue.js";
import Runtime from "../investigation/AfriDebugLiveRuntime.js";
import Bus from "../events/AfriDebugEventBus.js";

const AfriDebugJobScheduler = {
  runNext() {
    const job = Queue.dequeue();

    if (!job) {
      return {
        success: false,
        reason: "QUEUE_EMPTY"
      };
    }

    job.status = "RUNNING";

    Bus.emit("scheduler.job.started", {
      queueId: job.id,
      project: job.project
    });

    const investigation = Runtime.start(job);

    return {
      success: true,
      queue: job,
      investigation
    };
  }
};

export default AfriDebugJobScheduler;
