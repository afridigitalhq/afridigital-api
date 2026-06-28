function scorePR(pr) {
  let score = 10;

  if (pr.message.includes("deploy")) score += 30;
  if (pr.message.includes("auth")) score += 25;
  if (pr.message.includes("server")) score += 20;
  if (pr.message.includes("ws") || pr.message.includes("websocket")) score += 15;

  const level =
    score < 30 ? "LOW" :
    score < 60 ? "MEDIUM" :
    score < 85 ? "HIGH" : "CRITICAL";

  return {
    score,
    level,
    advisory: true
  };
}

module.exports = { scorePR };
