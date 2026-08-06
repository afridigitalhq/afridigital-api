const history = [];

const AfriDebugHistory = {

  record(entry = {}) {

    const item = {
      id:`DEBUG-RUN-${Date.now()}`,
      ...entry,
      timestamp:Date.now()
    };

    history.push(item);

    return item;
  },


  list() {
    return history;
  }

};

export default AfriDebugHistory;
