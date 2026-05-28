module.exports = {
  detect(text){
    const t = text.toLowerCase();

    if(t.includes("pay") || t.includes("buy") || t.includes("price")){
      return "commerce";
    }

    if(t.includes("error") || t.includes("help") || t.includes("fix")){
      return "support";
    }

    if(t.includes("deploy") || t.includes("server") || t.includes("log")){
      return "devops";
    }

    return "general";
  }
};
