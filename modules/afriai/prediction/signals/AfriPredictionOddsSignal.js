export function buildOddsSignal({odds={}}={}){return Object.freeze({type:"AFRI_PREDICTION_ODDS_SIGNAL",home:Number.isFinite(Number(odds.home))?Number(odds.home):null,draw:Number.isFinite(Number(odds.draw))?Number(odds.draw):null,away:Number.isFinite(Number(odds.away))?Number(odds.away):null})}
export default Object.freeze({build:buildOddsSignal});
