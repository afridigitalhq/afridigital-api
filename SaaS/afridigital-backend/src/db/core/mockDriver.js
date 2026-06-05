async function connect() {
  console.log("⚠️ Mock DB Mode Active");
}

async function find(_, query) {
  return [];
}

async function insert(_, data) {
  return { id: "mock", ...data };
}

module.exports = { connect, find, insert };
