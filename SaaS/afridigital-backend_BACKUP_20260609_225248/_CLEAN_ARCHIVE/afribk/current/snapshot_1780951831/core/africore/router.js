module.exports = {
  route(ai){
    const actions = [];

    if(ai.category === "devops") actions.push("send_message");
    if(ai.category === "support") actions.push("send_message");
    if(ai.category === "commerce") actions.push("send_message");

    return actions;
  }
};
