/**
 * PARALLEL AGENT EXECUTION v1
 */

async function runParallel(tasks = []) {
  return Promise.all(
    tasks.map(async (task) => {
      try {
        const result = await task();
        return { ok: true, result };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    })
  );
}

module.exports = {
  runParallel
};
