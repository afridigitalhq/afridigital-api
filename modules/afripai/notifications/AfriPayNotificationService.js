const AfriPayNotificationService={
  depositCredited({userId="",amount=0,currency="AfriCoin",reference=""}={}){return{status:"NOTIFICATION_READY",type:"DEPOSIT_CREDITED",userId,amount,currency,reference};}
};
export default AfriPayNotificationService;
