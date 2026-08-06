const invoices = [];

const AfriDebugBillingBridge = {

  createCharge(usage = {}) {
    const charge = {
      id:`CHARGE-${Date.now()}`,
      usageId:usage.id || null,
      credits:usage.credits || 0,
      currency:"AfriCoin",
      status:"PENDING",
      createdAt:Date.now()
    };

    invoices.push(charge);

    return charge;
  },

  confirmPayment(id) {
    const invoice = invoices.find(x => x.id === id);

    if (!invoice) {
      return {
        success:false,
        reason:"CHARGE_NOT_FOUND"
      };
    }

    invoice.status="PAID";

    return {
      success:true,
      invoice
    };
  },

  list() {
    return invoices;
  }

};

export default AfriDebugBillingBridge;
