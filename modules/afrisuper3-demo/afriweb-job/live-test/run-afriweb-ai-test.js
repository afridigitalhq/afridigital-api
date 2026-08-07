import AfriWebAIRoute from "../../../afriweb/routes/AfriWebAIRoute.js";

const result = await AfriWebAIRoute.handle({
  message: "Explain how AfriCommerce helps African businesses"
});

console.log(JSON.stringify(result, null, 2));
