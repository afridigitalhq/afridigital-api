function safetyGuard(action) {
  const blocked = [
    "rm -rf",
    "reinstall",
    "self-upgrade",
    "overwrite core",
    "modify server",
    "process kill kernel"
  ];

  const payload = JSON.stringify(action || {}).toLowerCase();

  for (const b of blocked) {
    if (payload.includes(b)) {
      return { allowed: false, reason: "BLOCKED_BY_AFRIAI_GUARD" };
    }
  }

  return { allowed: true };
}

module.exports = { safetyGuard };
