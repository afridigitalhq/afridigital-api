const crypto = require("crypto");

function hash(msg) {
  return crypto.createHash("sha256").update(msg).digest("hex");
}

function classify(message) {
  const text = (message.text || "").toLowerCase();

  if (text.includes("otp") || text.includes("code")) return "HIGH";
  if (text.includes("payment") || text.includes("order")) return "HIGH";
  if (text.includes("hi") || text.includes("hello")) return "MEDIUM";

  return "LOW";
}

function isSpam(redis, message) {
  const key = `spam:${message.user}:${hash(message.text || "")}`;
  return redis.get(key).then(v => !!v);
}

async function mark(redis, message) {
  const key = `spam:${message.user}:${hash(message.text || "")}`;
  await redis.set(key, "1", { EX: 60 }); // 60s window
}

async function route(redis, message) {
  const priority = classify(message);

  const spam = await isSpam(redis, message);
  if (spam) {
    return { lane: "wa:drop", priority, reason: "spam_detected" };
  }

  await mark(redis, message);

  if (priority === "HIGH") {
    return { lane: "wa:outbox", priority };
  }

  if (priority === "MEDIUM") {
    return { lane: "wa:outbox", priority };
  }

  return { lane: "wa:delay", priority };
}

module.exports = { route };
