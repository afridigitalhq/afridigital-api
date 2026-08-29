export function buildFormSignal({homeForm=[],awayForm=[]}={}){return Object.freeze({type:"AFRI_PREDICTION_FORM_SIGNAL",home:Array.isArray(homeForm)?homeForm:[],away:Array.isArray(awayForm)?awayForm:[]})}
export default Object.freeze({build:buildFormSignal});
