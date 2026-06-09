const { register } = require('./clusterRegistry');
const { createClusterRouter } = require('./clusterRouter');
const { createClusterExecutor } = require('./clusterExecutor');
const memory = require('./clusterMemory');

function createKernel() {

  // master node (Render in real deployment)
  register("render-master", { role: "master" });
  register("termux-edge", { role: "edge" });

  const executor = createClusterExecutor({}, memory);
  const router = createClusterRouter(require('./clusterRegistry'));

  return {
    router,
    memory,

    start() {
      console.log("🌐 AFRIKERNEL v9 ONLINE (AUTONOMOUS CLUSTER BRAIN)");
      return this;
    },

    dispatch(job) {
      return router.route(job, executor.execute);
    }
  };
}

module.exports = { createKernel };
