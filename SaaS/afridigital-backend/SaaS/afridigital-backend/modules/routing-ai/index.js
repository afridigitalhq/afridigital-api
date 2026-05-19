function route(event){if(event.channel==='whatsapp')return 'node-a';if(event.channel==='web')return 'node-b';return 'node-c';}module.exports={route};
