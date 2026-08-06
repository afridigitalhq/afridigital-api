import Persistence from "./AfriDebugKnowledgePersistence.js";

const records = Persistence.load();

const AfriDebugKnowledgeStore = {

  save(record = {}) {

    const entry = {
      id: record.id || `KNOW-${Date.now()}`,
      issue: record.issue || "",
      diagnosis: record.diagnosis || "",
      resolution: record.resolution || "",
      verified: record.verified || false,
      createdAt: record.createdAt || Date.now()
    };

    records.push(entry);

    Persistence.save(records);

    return entry;
  },

  find(issue = "") {
    return records.filter(item =>
      item.issue.toLowerCase() === issue.toLowerCase()
    );
  },

  list() {
    return [...records];
  },

  update(id, data = {}) {
    const record = records.find(r => r.id === id);
    if (!record) return null;
    Object.assign(record, data);
    return record;
  },

  remove(id) {
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return false;
    records.splice(index, 1);
    return true;
  },

  health() {
    return {
      service: "AfriDebugKnowledgeStore",
      records: records.length,
      status: "healthy"
    };
  }

};

export default AfriDebugKnowledgeStore;
