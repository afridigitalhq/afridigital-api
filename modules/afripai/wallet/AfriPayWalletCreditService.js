const AfriPayWalletCreditService={
  credit({walletId="",amount=0,currency="AfriCoin",reference=""}={}){return{status:"CREDIT_PENDING",walletId,amount,currency,reference};}
};
export default AfriPayWalletCreditService;
