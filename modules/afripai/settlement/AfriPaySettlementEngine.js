const AfriPaySettlementEngine={
  settle(payment={}){return{status:"SETTLEMENT_PENDING",payment,settlementLayer:"AfriPay"};}
};
export default AfriPaySettlementEngine;
