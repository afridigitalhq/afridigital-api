const { assertApiVersion } = require("../runtime/safety/api.guard");
const crypto = require('crypto');

class TaskEngine {

  constructor() {
    this.tasks = new Map();
    this.submissions = new Map();
  }

  createTask(data) {
    const id = crypto.randomUUID();

    this.tasks.set(id, {
      id,
      ...data,
      status: "active",
      createdAt: Date.now()
    });

    return this.tasks.get(id);
  }

  submitProof(taskId, userId, proof) {
    const submissionId = crypto.randomUUID();

    this.submissions.set(submissionId, {
      submissionId,
      taskId,
      userId,
      proof,
      status: "pending",
      submittedAt: Date.now()
    });

    return this.submissions.get(submissionId);
  }

}

module.exports = new TaskEngine();
