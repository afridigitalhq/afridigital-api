const sendWhatsApp = require('../core/sendWhatsApp');

module.exports = async function send_message(args){
  const {to, message} = args;
  if(!to || !message) throw new Error('Missing params');

  await sendWhatsApp(to, message);
  return {status:'sent'};
};