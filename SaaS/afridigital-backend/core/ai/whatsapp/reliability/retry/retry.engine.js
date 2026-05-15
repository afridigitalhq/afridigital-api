/**
 * 🔁 RETRY ENGINE (SAFE DELIVERY GUARANTEE)
 */

function shouldRetry(job) {
  return job.attempts < 3;
}

function backoffDelay(attempt) {
  return Math.min(1000 * Math.pow(2, attempt), 30000);
}

function registerFailure(job) {
  job.attempts += 1;

  if (shouldRetry(job)) {
    job.nextRetry = Date.now() + backoffDelay(job.attempts);
    return "RETRY_SCHEDULED";
  }

  job.status = "FAILED";
  return "FAILED_FINAL";
}

module.exports = { shouldRetry, registerFailure };
