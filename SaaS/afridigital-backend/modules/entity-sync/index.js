const bus=require('../ai-event-bus');

function sync(event){
bus.emit({
type:'ENTITY_SYNC',
payload:event
});
}

module.exports={sync};