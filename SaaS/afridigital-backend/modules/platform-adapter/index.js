const bus=require('../notification-bus');

bus.subscribe((event)=>{
console.log('[NOTIFY]',event);
});