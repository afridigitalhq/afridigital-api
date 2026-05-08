module.exports = {
  run: (node, event) => {
    console.log(`⚙️ Node ${node} processing:`, event.type);
  }
};
