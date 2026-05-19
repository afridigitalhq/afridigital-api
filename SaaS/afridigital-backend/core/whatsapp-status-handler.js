function handleWhatsAppStatus(entry) {
  try {
    const change = entry?.[0]?.changes?.[0]?.value;

    const statuses = change?.statuses;
    if (!statuses || !statuses.length) return;

    statuses.forEach(status => {
      const messageId = status.id;
      const statusType = status.status; // sent | delivered | read
      const timestamp = status.timestamp;

      console.log("📊 WHATSAPP STATUS UPDATE:", {
        messageId,
        status: statusType,
        timestamp
      });

      // 👉 Later we can persist this in DB
      // updateMessageStatus(messageId, statusType);
    });

  } catch (err) {
    console.error("STATUS HANDLER ERROR:", err.message);
  }
}

module.exports = { handleWhatsAppStatus };
