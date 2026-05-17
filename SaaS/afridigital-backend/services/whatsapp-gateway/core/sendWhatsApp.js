const typing = require('./typing');

module.exports = async function sendWhatsApp(to, message){

  // ⌨️ simulate human typing delay
  const delay = Math.min(800 + message.length * 20, 3500);
  await typing(delay);

  console.log('⌨️ typing done');
  console.log('📤 sending:', {to, message});

  // later: Meta API / Twilio here
  return {ok:true};
};