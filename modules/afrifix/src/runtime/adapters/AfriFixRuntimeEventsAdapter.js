import CoreEventBus from "../../../../core/events/CoreEventBus.js";
const AfriFixRuntimeEventsAdapter={publish(type,payload={}){return CoreEventBus.emit(type,payload);},listen(type){return CoreEventBus.listen(type);}};
export default AfriFixRuntimeEventsAdapter;
