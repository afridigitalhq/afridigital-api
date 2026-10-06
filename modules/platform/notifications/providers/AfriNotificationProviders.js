const providers = {};

const AfriNotificationProviders = {
  register(channel, adapter) {
    if (!channel || !adapter) {
      throw new Error("Invalid notification provider");
    }

    providers[channel] = adapter;

    return {
      channel,
      status: "REGISTERED"
    };
  },

  get(channel) {
    return providers[channel] || null;
  },

  list() {
    return Object.keys(providers);
  },

  all() {
    return Object.values(providers);
  }
};

export default AfriNotificationProviders;
