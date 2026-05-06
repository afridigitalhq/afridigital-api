function truthLock(response, fallback = "⚡ AI is processing your request...") {
  if (!response) return fallback;
  if (typeof response !== "string") return fallback;
  if (response.trim().length === 0) return fallback;
  return response;
}
module.exports = { truthLock };
