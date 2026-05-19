function send(channel,data){
console.log('[ADMIN ALERT]',channel,JSON.stringify(data,null,2));
}

module.exports={send};