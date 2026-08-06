const clients = [];
const cases = [];

const AfriDebugClientWorkspace = {

  createClient(name) {

    const client = {
      id:`CLIENT-${Date.now()}`,
      name,
      createdAt:Date.now()
    };

    clients.push(client);

    return client;
  },


  createCase(input = {}) {

    const item = {
      id:`CASE-${Date.now()}`,
      clientId:input.clientId || null,
      project:input.project || null,
      issue:input.issue || null,
      status:"OPEN",
      createdAt:Date.now()
    };

    cases.push(item);

    return item;
  },


  clients() {
    return clients;
  },


  cases() {
    return cases;
  }

};

export default AfriDebugClientWorkspace;
