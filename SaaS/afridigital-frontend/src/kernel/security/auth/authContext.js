let role = "user";

export const authContext = {
  setRole(r) {
    role = r;
  },

  getRole() {
    return role;
  }
};
