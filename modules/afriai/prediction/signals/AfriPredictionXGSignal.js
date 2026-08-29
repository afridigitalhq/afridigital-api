export function buildXGSignal({xg={}}={}){return Object.freeze({type:"AFRI_PREDICTION_XG_SIGNAL",home:Number.isFinite(Number(xg.home))?Number(xg.home):null,away:Number.isFinite(Number(xg.away))?Number(xg.away):null})}
export default Object.freeze({build:buildXGSignal});
