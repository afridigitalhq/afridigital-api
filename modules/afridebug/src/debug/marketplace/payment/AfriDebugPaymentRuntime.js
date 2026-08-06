const payments = [];

const AfriDebugPaymentRuntime = {

  create(quote = {}) {

    const payment = {

      id:`PAY-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      quoteId:quote.id || null,

      amount:quote.pricing?.amount || 0,

      currency:quote.pricing?.currency || "AfriCoin",

      status:"PENDING",

      createdAt:Date.now()
    };

    payments.push(payment);

    return payment;
  },


  confirm(id){

    const payment = payments.find(
      x=>x.id===id
    );

    if(!payment){
      return {
        success:false,
        reason:"PAYMENT_NOT_FOUND"
      };
    }

    payment.status="PAID";

    return {
      success:true,
      payment
    };
  },


  list(){
    return payments;
  },


  stats(){

    return {
      payments:payments.length,
      paid:payments.filter(
        x=>x.status==="PAID"
      ).length
    };
  }

};

export default AfriDebugPaymentRuntime;
