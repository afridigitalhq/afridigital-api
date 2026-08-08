import CoreEventBus from "../../../../core/events/CoreEventBus.js";
const AfriFixRuntimeEventStoreAdapter={save(event){return CoreEventBus.emit(event.type||"AFRIFIX_RUNTIME_EVENT",event);},load(){return {status:"CORE_EVENT_STORE_DELEGATED"};}};
export default AfriFixRuntimeEventStoreAdapter;
