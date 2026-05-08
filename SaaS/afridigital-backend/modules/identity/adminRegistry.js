require('dotenv').config();const ADMIN_NUMBERS=(process.env.ADMIN_NUMBERS||'').split(',').map(n=>n.trim());module.exports={isAdmin:(id)=>ADMIN_NUMBERS.includes(id),getAdmins:()=>ADMIN_NUMBERS};
