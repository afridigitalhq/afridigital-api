const state = {
  role: "USER" // default
};

export const authContext = {
  setRole(role) {
    state.role = role;
  },

  getRole() {
    return state.role;
  },

  isAdmin() {
    return state.role === "ADMIN";
  }
};
