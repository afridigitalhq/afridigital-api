export class SOCAuditLogger {

  log(entry) {
    const record = {
      ...entry,
      loggedAt: Date.now()
    };

    // In real system → write to DB / Kafka / SIEM
    console.log("🧿 SOC_AUDIT:", JSON.stringify(record, null, 2));

    return record;
  }
}
