import fs from "fs";

const FILE = "./memory.json";
let memory = [];

function load() {
  try {
    memory = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    memory = [];
  }
}

function save() {
  fs.writeFileSync(FILE, JSON.stringify(memory, null, 2));
}

export const memoryGraph = {
  init() {
    load();
  },

  add(event) {
    memory.push({ ...event, ts: Date.now() });
    save();
  },

  getAll() {
    return memory;
  }
};
