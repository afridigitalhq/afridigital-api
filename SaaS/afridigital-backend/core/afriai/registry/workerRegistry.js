const workers = new Map();

function registerWorker(id, handler, meta = {}) {
  workers.set(id, {
    handler,
    meta,
    busy: false,
    lastSeen: Date.now()
  });

  console.log(`🧩 WORKER REGISTERED: ${id}`);
}

function getAvailableWorker() {
  for (const [id, worker] of workers.entries()) {
    if (!worker.busy) return { id, ...worker };
  }
  return null;
}

async function dispatch(task) {
  const worker = getAvailableWorker();

  if (!worker) {
    console.log("⚠️ NO WORKERS AVAILABLE");
    return null;
  }

  worker.busy = true;

  try {
    const result = await worker.handler(task);
    worker.busy = false;
    return result;
  } catch (err) {
    worker.busy = false;
    throw err;
  }
}

module.exports = {
  registerWorker,
  getAvailableWorker,
  dispatch
};
