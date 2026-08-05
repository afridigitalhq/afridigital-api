const CoreEventBus={emit(event,data){return {event,data,status:"EMITTED"};},listen(event){return {event,status:"LISTENING"};}};
export default CoreEventBus;
