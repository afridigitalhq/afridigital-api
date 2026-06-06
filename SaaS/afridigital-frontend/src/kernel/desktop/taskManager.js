const tasks = [];
const listeners = [];

export const taskManager = {
  init() {
    tasks.length = 0;
  },

  subscribe(fn) {
    listeners.push(fn);
  },

  notify() {
    listeners.forEach(fn => fn([...tasks]));
  },

  register(win) {
    if (!tasks.find(t => t.id === win.id)) {
      tasks.push({
        id: win.id,
        title: win.title,
        active: true
      });
    }
    this.notify();
  },

  remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) tasks.splice(index, 1);
    this.notify();
  },

  setActive(id) {
    tasks.forEach(t => t.active = t.id === id);
    this.notify();
  },

  getAll() {
    return tasks;
  }
};
