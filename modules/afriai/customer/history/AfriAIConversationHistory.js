const AfriAIConversationHistory={
save(message={}){
return{
...message,
saved:true
};
},
list(){
return[];
}
};

export default AfriAIConversationHistory;
