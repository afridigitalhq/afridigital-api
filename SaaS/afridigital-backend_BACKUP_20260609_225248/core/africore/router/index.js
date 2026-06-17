module.exports = {
  route(ai){

    const actions = [];

    if(ai.category === "support"){
      actions.push("check_logs", "send_message");
    }

    if(ai.category === "devops"){
      actions.push("check_server", "send_alert");
    }

    if(ai.category === "commerce"){
      actions.push("init_payment_flow");
    }

    return actions;
  }
};
