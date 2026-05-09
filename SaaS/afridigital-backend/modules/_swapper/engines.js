module.exports={fast:(i)=>'Got it 👍',balanced:(i)=>'Processing...',reasoning:(i)=>require('../reasoning').generate(i),memory:(i)=>require('../memory-v2').getContext(i.userId||'u',i.message||'')};
