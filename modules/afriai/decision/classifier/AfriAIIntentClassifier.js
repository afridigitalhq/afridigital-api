const AfriAIIntentClassifier={
classify(message=""){
const text=message.toLowerCase();

if(text.includes("buy")||text.includes("shop")||text.includes("sell"))
return "commerce";

if(text.includes("pay")||text.includes("money")||text.includes("coin"))
return "payment";

if(text.includes("help")||text.includes("support"))
return "support";

return "general";
}
};

export default AfriAIIntentClassifier;
