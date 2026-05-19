const ADMIN=(process.env.ADMIN_NUMBERS||'').split(',');

function isAdmin(id){return ADMIN.includes(id);}

module.exports={isAdmin};