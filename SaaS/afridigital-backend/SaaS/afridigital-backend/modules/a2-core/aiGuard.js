function aiGuard(payload) {
  try {
    if (!payload) {
      return { ok: false, error: "EMPTY_PAYLOAD" };
    }

    if (typeof payload.message !== "string") {
      return { ok: false, error: "INVALID_MESSAGE_TYPE" };
    }

    if (payload.message.trim().length === 0) {
      return { ok: false, error: "EMPTY_MESSAGE" };
    }

    return {
      ok: true,
      data: {
        message: payload.message.trim(),
        channel: payload.channel || "web",
        from: payload.from || "system"
      }
    };
  } catch (err) {
    return { ok: false, error: "GUARD_FAILURE" };
  }
}

module.exports = aiGuard;
