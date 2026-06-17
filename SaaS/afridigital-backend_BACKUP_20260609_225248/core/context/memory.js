const store = new Map();

function getContext(userId) {
  if (!store.has(userId)) {
    store.set(userId, {
      messages: [],
      summary: ""
    });
  }
  return store.get(userId);
}

function push(userId, msg) {
  const ctx = getContext(userId);

  ctx.messages.push({
    text: msg,
    ts: Date.now()
  });

  if (ctx.messages.length > 10) {
    ctx.summary = ctx.messages.map(m => m.text).join(" | ").slice(0, 200);
    ctx.messages = ctx.messages.slice(-5);
  }

  store.set(userId, ctx);
  return ctx;
}

module.exports = { getContext, push };
