const AfriAIIntentClassifier = {
  classify(message = "") {
    const text = String(message).toLowerCase().trim();

    if (
      text.includes("buy") ||
      text.includes("shop") ||
      text.includes("sell") ||
      text.includes("marketplace") ||
      text.includes("commerce") ||
      text.includes("product")
    ) {
      return "commerce";
    }

    if (
      text.includes("pay") ||
      text.includes("payment") ||
      text.includes("coin") ||
      text.includes("wallet") ||
      text.includes("transfer")
    ) {
      return "payment";
    }

    if (
      text.includes("job") ||
      text.includes("jobs") ||
      text.includes("work") ||
      text.includes("hiring") ||
      text.includes("freelance") ||
      text.includes("career") ||
      text.includes("earn") ||
      text.includes("income") ||
      text.includes("make money") ||
      text.includes("opportunit")
    ) {
      return "opportunity";
    }

      if (
        text.includes("teach me") ||
        text.includes("lesson") ||
        text.includes("learn") ||
        text.includes("study") ||
        text.includes("quiz me") ||
        text.includes("course") ||
        text.includes("algebra") ||
        text.includes("mathematics") ||
        text.includes("math") ||
        text.includes("biology") ||
        text.includes("physics") ||
        text.includes("chemistry") ||
        text.includes("photosynthesis") ||
        text.includes("solve this") ||
        text.includes("explain this") ||
        text.includes("explain the") ||
        text.includes("create a lesson") ||
        text.includes("detailed lesson")
      ) {
        return "education";
      }

    if (
      text.includes("help") ||
      text.includes("support") ||
      text.includes("problem") ||
      text.includes("issue") ||
      text.includes("contact") ||
      text.includes("can't") ||
      text.includes("cannot")
    ) {
      return "support";
    }

    if (
      text.includes("hello") ||
      text.includes("hi") ||
      text.includes("hey") ||
      text.includes("good morning") ||
      text.includes("good afternoon") ||
      text.includes("good evening")
    ) {
      return "greeting";
    }

    if (
      text.includes("afridigital") ||
      text.includes("africommerce") ||
      text.includes("africctv") ||
      text.includes("afriwork") ||
      text.includes("afriboost") ||
      text.includes("afridesign") ||
      text.includes("afriweather") ||
      text.includes("afripayment") ||
      text.includes("africoin") ||
      text.includes("service") ||
      text.includes("services") ||
      text.includes("product") ||
      text.includes("platform") ||
      text.includes("roadmap") ||
      text.includes("development") ||
      text.includes("status")
    ) {
      return "information";
    }

    return "general";
  }
};

export default AfriAIIntentClassifier;
