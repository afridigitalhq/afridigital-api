import fs from "node:fs";
import path from "node:path";

const DB = path.resolve(
  "src/core/afriai/debug/storage/knowledge.json"
);

const read = () => {
  try {
    return JSON.parse(fs.readFileSync(DB, "utf8"));
  } catch {
    return [];
  }
};

const write = (records) => {

  fs.mkdirSync(
    path.dirname(DB),
    { recursive:true }
  );

  fs.writeFileSync(
    DB,
    JSON.stringify(records, null, 2)
  );
};

const AfriDebugKnowledgePersistence = {

  load() {
    return read();
  },

  save(records = []) {
    write(records);
    return {
      saved: records.length
    };
  },

  append(record = {}) {
    const records = read();
    records.push(record);
    write(records);
    return record;
  },

  stats() {
    const records = read();
    return {
      records: records.length,
      database: DB
    };
  },

  health() {
    return {
      service: "AfriDebugKnowledgePersistence",
      status: "healthy",
      records: read().length
    };
  }

};

export default AfriDebugKnowledgePersistence;
