export const identity = {
  current: null,

  set(user) {
    this.current = {
      id: user.id,
      role: user.role || "user",
      phone: user.phone || null
    };
  },

  get() {
    return this.current;
  },

  isAdmin() {
    return this.current?.role === "admin";
  }
};
