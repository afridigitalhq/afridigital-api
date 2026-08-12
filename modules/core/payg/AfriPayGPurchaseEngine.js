import AfriPayGPriceResolver from "./AfriPayGPriceResolver.js";
import AfriBillingTransactionEngine from "../billing/AfriBillingTransactionEngine.js";
import AfriPaymentReceiptEngine from "../billing/AfriPaymentReceiptEngine.js";
import AfriPayGCreditRegistry from "./AfriPayGCreditRegistry.js";
import AfriEntitlementRegistry from "../entitlements/AfriEntitlementRegistry.js";

const AfriPayGPurchaseEngine={

 purchase(request={}){

  const price=
   AfriPayGPriceResolver.resolve({
    feature:request.feature
   });

  const transaction=
   AfriBillingTransactionEngine.record({
    userId:request.userId,
    product:request.product,
    feature:request.feature,
    paymentType:"PAYG",
    currency:price.currency,
    amount:price.price
   });

  const receipt=
   AfriPaymentReceiptEngine.generate(transaction);

  const credit=AfriPayGCreditRegistry.grant({
    userId:request.userId,
    product:request.product,
    feature:request.feature,
    quantity:1
   });

  const entitlement=
   AfriEntitlementRegistry.resolve(
    request.userId,
    request.product
   );

  return {
   transaction,
   receipt,
   entitlement,
   credit,
   featureUnlocked:true,
   status:"PAYG_PURCHASE_COMPLETED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriPayGPurchaseEngine;
