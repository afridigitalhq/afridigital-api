const memory=require('../memory/core');
const sync=require('../entity-sync');

async function process(input){
sync.sync(input);

const ctx=memory.search(input.userId||'u',input.message||'');

return {
reply:ctx.length ? 'I remember this context: '+ctx[0].message : 'Understood.',
context:ctx
};
}

module.exports={process};