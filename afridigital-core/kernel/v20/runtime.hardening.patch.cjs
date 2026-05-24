function safeStreamCursor() {
  return "$";
}

function safeGroup(stream, group) {
  return { stream, group, cursor: "$" };
}

function wrapAsync(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (e) {
      console.log("🧯 Safe layer caught error:", e.message);
      return null;
    }
  };
}

module.exports = {
  safeStreamCursor,
  safeGroup,
  wrapAsync
};
