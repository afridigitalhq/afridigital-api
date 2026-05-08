function resolveRole(id,registry){if(!id)return 'unknown';if(registry.isAdmin(id))return 'admin';return 'user';}module.exports={resolveRole};
