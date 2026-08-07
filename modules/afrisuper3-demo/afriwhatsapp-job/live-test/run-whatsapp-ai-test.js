import AfriWhatsAppRuntime from "../../../afriwhatsapp/runtime/AfriWhatsAppRuntime.js";

const result = await AfriWhatsAppRuntime.receive({
  from: "test-user",
  message: "Explain how AfriCommerce helps African businesses"
});

console.log(JSON.stringify(result,null,2));
