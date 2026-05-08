const bus=require('../notification-bus');

function notifyAdmin(event){
bus.publish({
target:'admin',
event
});
}

module.exports={notifyAdmin};