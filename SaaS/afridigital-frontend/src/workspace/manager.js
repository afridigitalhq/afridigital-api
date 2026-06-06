export const Workspaces = {
  active: "default",
  spaces: {
    default: []
  },

  create(name) {
    this.spaces[name] = [];
  },

  switch(name) {
    this.active = name;
  }
};
